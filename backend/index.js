import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import passport from "passport";
import session from "express-session";
import {buildContext} from "graphql-passport"

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import connectDB from "./db/connnectDB.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import mongoDBSession from "./db/mongodbSession.js";
import { configurePassport } from "./passport/passport.config.js";
const app= express();

const https = http.createServer(app);

app.use(cors(
    {
        origin: "http://localhost:3000",
		credentials: true,
    }
));
app.use(express.json());

await configurePassport();

const mongoSessionStore=await mongoDBSession();
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            httpOnly: true,
        },
        store: mongoSessionStore,
    })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs:mergedTypeDefs,
    resolvers:mergedResolvers,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer: https }),
    ],
});


await server.start();
app.use("/graphql", expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res })
}));

app.use(express.static(path.join(path.resolve(), "frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.join(path.resolve(), "frontend/dist", "index.html"));
})

const PORT=process.env.PORT || 4000;
await new Promise((resolve) => https.listen({ port: PORT }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);