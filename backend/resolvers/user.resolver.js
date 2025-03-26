import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import Transaction from "../models/transaction.model.js";

const userResolvers = {
    Query: {
        authUser: async(_,{},context) =>{
            try {
                const user=await context.getUser();
                return user
            } catch (error) {
                console.error(`Error in authUser: ${error.message}`);
                throw new Error(error.message || `Internal server error`); 
            }
        },    
        user:async(_,{userId})=>{
            try {
                const user=await userModel.findById(userId);
                return user
            } catch (error) {
                console.error(`Error in user: ${error.message}`);
                throw new Error(error.message || `Internal server error`);
            }
        }
    },
    Mutation:{
        signUp:async(_,{input},context)=>{
            try {
                const {username,name,password,gender}=input;
                if(!username || !name || !password || !gender){
                    throw new Error("All fields are required")
                }
                const isExitUser=await userModel.findOne({username});
                if(isExitUser){
                    throw new Error("User already exist")
                }
                const salt=await bcrypt.genSalt(10);
                const hashPassword=await bcrypt.hash(password,salt);
                const boyProfilePicture=`https://avatar.iran.liara.run/public/boy?username=${username}`
                const grilProfilePicture=`https://avatar.iran.liara.run/public/boy?username=${username}`
                const newUser={
                    username,
                    name,
                    password:hashPassword,
                    gender,
                    profilePicture:(gender==="male"?boyProfilePicture:grilProfilePicture)
                }
                const isCreated=await userModel.create(newUser);
                if(!isCreated){
                    throw new Error("User not created")
                }
                await context.login(isCreated);
                return isCreated;
            } catch (error) {
                console.error(`Error in signUp: ${error}`);
                
                throw new Error(error.message || `Internal server error`);
            }
        },
        login:async(_,{input},context)=>{
            try {
                const {username,password}=input;
                if(!username || !password){
                    throw new Error("All fields are required")
                }
                const {user}=await context.authenticate('graphql-local',{username,password});
                if(!user){
                    throw new Error("User not found")
                }
                
                await context.login(user);
                return user;
            } catch (error) {                
                throw new Error(error.message || `Internal server error`);
            }
        },
        logout:async(_, __, context)=>{
            try {
                await context.logout();
                context.req.session.destroy((err)=>{
                    if(err){
                        throw new Error("Unable to log out")
                    }
                })
                context.res.clearCookie("connect.sid");

                return {message:"Logged out successfully"}
            } catch (error) {
                throw new Error(error.message || `Internal server error`);
            }
        }
    },
    User: {
		transactions: async (parent) => {
			try {
				const transactions = await Transaction.find({ userId: parent._id });
				return transactions;
			} catch (err) {
				console.log("Error in user.transactions resolver: ", err);
				throw new Error(err.message || "Internal server error");
			}
		},
	},
};
export default userResolvers;