import session from "express-session";
import connectMongoSession from "connect-mongodb-session";


const mongoDBSession=async()=>{
    return new Promise((resolve, reject) => {
        // const connectionURl=`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
        const connectionURl=process.env.ATLASH_DB_URL;
        const MongoDBStore = connectMongoSession(session);
        const mongoSessionStore = new MongoDBStore({
            uri: connectionURl,
            collection: "sessions",
        });
        mongoSessionStore.on("error", (error) => {
            reject(error);
        });
        mongoSessionStore.on("connected", () => {
            resolve(mongoSessionStore);
        });
    });
}

export default mongoDBSession;
