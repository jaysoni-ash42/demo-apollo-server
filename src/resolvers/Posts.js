import Post from "../Models/Post.js";

const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find();
        return posts;
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};

export default postResolvers;
