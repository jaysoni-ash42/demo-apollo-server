import Post from "../Models/Post.js";
import { authCheckAuth } from "../util/checkAuth.js";
import { UserInputError, AuthenticationError } from "apollo-server";
const postResolvers = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (e) {
        throw new Error(e);
      }
    },
    async getPost(_, { id }) {
      try {
        const post = await Post.findById(id);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = authCheckAuth(context);
      const post = new Post({
        body,
        user: user.id,
        userName: user.userName,
        createdAt: new Date().toISOString(),
      });
      try {
        const newPost = await post.save();
        return newPost;
      } catch (e) {
        throw new Error(e);
      }
    },
    async deletePost(_, { id }, context) {
      const user = authCheckAuth(context);
      try {
        const post = await Post.findById(id);
        if (post) {
          if (post.userName === user.userName) {
            await post.delete();
            return { success: "Post SuccessFully deleted" };
          } else {
            throw new Error("Authentication Error");
          }
        } else {
          throw new Error("Post Not Found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async createComment(_, { postId, body }, context) {
      const { userName } = authCheckAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("error", {
          errors: {
            body: "no body Sent",
          },
        });
      } else {
        try {
          const post = await Post.findById(postId);
          if (post) {
            post.comments.unshift({
              body,
              userName,
              createdAt: new Date().toISOString(),
            });
            await post.save();
            return post;
          } else {
            throw new Error("Post Not Found");
          }
        } catch (e) {
          throw new Error(e);
        }
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { userName } = authCheckAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          const commentIndex = post.comments.findIndex(
            (c) => c.id === commentId
          );
          if (commentIndex != -1) {
            if (post.comments[commentIndex].userName === userName) {
              post.comments.splice(commentIndex, 1);
              await post.save();
              return {
                success: "Comment Successfully deleted",
              };
            } else {
              throw new AuthenticationError("Authentication error");
            }
          } else {
            throw new Error("Comment Not Found");
          }
        } else {
          throw new Error("Post Not Found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },

    async likePost(_, { postId }, context) {
      const { userName } = authCheckAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          if (post.likes.find((like) => like.userName === userName)) {
            throw new Error("Post Already Liked");
          } else {
            post.likes.unshift({
              userName,
              createdAt: new Date().toISOString(),
            });
            await post.save();
            return {
              success: "Post successfully liked",
            };
          }
        } else {
          throw new Error("Post Not Found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
    async unlikePost(_, { postId, likeId }, context) {
      const { userName } = authCheckAuth(context);
      try {
        const post = await Post.findById(postId);
        if (post) {
          const likeIndex = post.likes.findIndex((i) => i.id === likeId);
          if (likeIndex != -1) {
            if (post.likes[likeIndex].userName === userName) {
              post.likes.splice(likeIndex, 1);
              await post.save();
              return {
                success: "Like Successfully deleted",
              };
            } else {
              throw new AuthenticationError("Authentication error");
            }
          } else {
            throw new Error("Like Not Found");
          }
        } else {
          throw new Error("Post Not Found");
        }
      } catch (e) {
        throw new Error(e);
      }
    },
  },
};

export default postResolvers;
