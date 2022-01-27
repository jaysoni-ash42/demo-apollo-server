import { ApolloServer } from "apollo-server";
import { typeDefs } from "./src/typeDefs.js";
import { dbConnect } from "./src/db.js";
import resolvers from "./src/resolvers/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
  }),
});

dbConnect().then(() => {
  console.log("databse is connected");
  return server
    .listen({ port: 3000 })
    .then((res) => {
      console.log(`server is running ${res.url}`);
    })
    .catch((e) => {
      console.log(`server stopped due to ${e}`);
    });
});
