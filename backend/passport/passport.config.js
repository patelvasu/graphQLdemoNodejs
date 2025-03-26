import passport from "passport";
import  bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport=async()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            const user=await userModel.findById(id);
            return done(null,user)
        }catch(err){
            return done(err)
        }
    })
    passport.use(new GraphQLLocalStrategy(async(username,password,done)=>{
        try{
            console.log("body",username,password);
            const user=await userModel.findOne({username});
            if(!user){
                throw new Error("Invalid username or password")
            }
            
            
            const isValid=await bcrypt.compare(password,user.password);
            if(!isValid){
                throw new Error("Invalid username or password")
            }
            return done(null,user)
        }catch(err){
            return done(err)
        }
    }))
}
