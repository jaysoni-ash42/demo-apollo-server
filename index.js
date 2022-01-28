import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "./src/typeDefs.js";
import { dbConnect } from "./src/db.js";
import resolvers from "./src/resolvers/index.js";
import express from "express";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";

(async function () {
  const app = express();

  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    { server: httpServer, path: "/graphql" }
  );

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req,
    }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({ app });

  dbConnect()
    .then(() => {
      console.log("databse is connected");
      const PORT = 4000;
      return httpServer.listen(PORT, () => {
        console.log("server is running on port 4000");
      });
    })
    .catch((e) => {
      console.log(`server stopped due to ${e}`);
    });
})();
