import postResolvers from "./Posts.js";
import userReslvers from "./Users.js";

const resolvers = {
  Post: {
    likeCount: (parent) => {
      return parent.likes.length;
    },
    commentCount: (parent) => {
      return parent.comments.length;
    },
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userReslvers.Mutation,
    ...postResolvers.Mutation,
  },
};

export default resolvers;
