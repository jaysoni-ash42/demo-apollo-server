import gql from "graphql-tag";

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    userName: String!
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
  type Query {
    getPosts: [Post]
  }
  type Mutation {
    register(registerInput: RegisterInput): RegisterUser!
    login(userName: String!, password: String!): LoginUser!
  }
`;
