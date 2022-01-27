import gql from "graphql-tag";

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    userName: String!
    createdAt: String!
  }
  type RegisterUser {
    id: ID!
    userName: String!
    email: String!
    createdAt: String!
  }
  type LoginUser {
    token: String!
  }
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type SuccessObject {
    success: String!
  }
  type Query {
    getPosts: [Post]
    getPost(id: ID!): Post!
  }
  type Mutation {
    register(registerInput: RegisterInput): RegisterUser!
    login(userName: String!, password: String!): LoginUser!
    createPost(body: String!): Post!
    deletePost(id: ID!): SuccessObject!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): SuccessObject!
    likePost(postId: ID!): SuccessObject!
    unlikePost(postId: ID!, likeId: ID!): SuccessObject!
  }
`;
