import { mergeResolvers } from "@graphql-tools/merge";
import  userResolver from   "./user.resolver.js";
import transactionResolver  from "./transaction.resolver.js";

export const mergedResolvers = mergeResolvers([userResolver, transactionResolver]);

export default mergedResolvers;