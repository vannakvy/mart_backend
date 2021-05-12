import { join } from "path";
import { error, success } from "consola";
import { PORT, IN_PROD } from "./config";
import { ApolloServer } from "apollo-server-express";
import { schemaDirectives } from "./graphql/directives";
import { createServer } from 'http'
import express from "express";
import bodyParser from "body-parser";
import * as AppModels from "./models";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import AuthMiddleware from "./middlewares/auth";
import connectDB from "./config/db";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from 'graphql';

const app = express();
// Remove x-powered-by header
app.disable("x-powered-by");
app.use(AuthMiddleware);
app.use(bodyParser.json());

// Set Express Static Directory
app.use(express.static(join(__dirname, "./uploads")));
const pubsub = new PubSub();
// Define the Apollo-Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: !IN_PROD,
  context: ({ req }) => {
    let { user, isAuth } = req;
    return { req, pubsub, user, isAuth, ...AppModels };
  },
});
// Function to start express and apollo server
const startApp = async () => {
  connectDB();
  try {
    // Connect With MongoDB Database
    // Apply Apollo-Express-Server Middlware to express application
    server.applyMiddleware({
      app,
      cors: true,
    });
const httpServer = createServer(app)
// server.installSubscriptionHandlers(httpServer)
    // Start Listening on the Server
    httpServer.listen(PORT,()=>{
      new SubscriptionServer({
        execute,
        subscribe,
        typeDefs
      }, {
        server: httpServer,
        path: '/subscriptions',
      }
      );
      console.log(`http://localhost:${PORT}${server.graphqlPath}`)
      console.log(`ws://localhost:${PORT}${server.subscriptionsPath}`)
    })

  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

// Invoke Start Application Function
startApp();
