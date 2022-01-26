import postResolvers from "./Posts.js";
import userReslvers from "./Users.js";

const resolvers = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userReslvers.Mutation,
  },
};

export default resolvers;
