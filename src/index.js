import { join } from "path";
import { error, success } from "consola";
import { PORT, IN_PROD } from "./config";
import { ApolloServer, PubSub } from "apollo-server-express";
import { schemaDirectives } from "./graphql/directives";
import express from "express";
import bodyParser from "body-parser";
import * as AppModels from "./models";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import AuthMiddleware from "./middlewares/auth";
import connectDB from "./config/db";
import http from "http";
import path from 'path'

const app = express();
// // Remove x-powered-by header
app.disable("x-powered-by");
app.use(bodyParser.json());


// Set Express Static Directory
// app.use(
//   '/uploads/eLearningUploads',
//   express.static(path.join(__dirname, '/uploads/eLearningUploads'))
//  );
 
//  app.use('/uploads/img', express.static(path.join(__dirname, '/uploads/img')));
 
//  app.use(
//   '/adminEbook/details',
//   express.static(path.join(__dirname, '/uploads/eBookUploads'))
//  );

 app.use(
  '/app/userProfile',
  express.static(path.join(__dirname, 'uploads'))
 );
 
 app.use(
  '/app',
  express.static(path.join(__dirname, 'uploads'))
 );
 app.use(
  '/app/productDetail',
  express.static(path.join(__dirname, './uploads'))
 );
 app.use(
  '/app/orderDetail',
  express.static(path.join(__dirname, './uploads'))
 );
 app.use(
  '/',
  express.static(path.join(__dirname, './uploads'))
 );
app.use(express.static(join(__dirname, "./uploads")));

const pubsub = new PubSub();
// Define the Apollo-Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  uploads: true,
  context: ({ req }) => {
    return { req, pubsub, ...AppModels };
  },
  subscriptions: {
    path: "/graphql",
    onConnect: async (connectionParams, webSocket, context) => {
      console.log("connection");
    },
    onDisconnect: async () => {
      console.log("disc");
    },
  },
  tracing: true,
  playground: !IN_PROD,
});

const startApp = async () => {
  connectDB();
  try {
    server.applyMiddleware({
      app,
      cors: true,
     
    });   

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`http://localhost:${PORT}${server.subscriptionsPath}`);
    });
  } catch (err) {
    error({
      badge: true,
      message: err.message,
    });
  }
};

// Invoke Start Application Function
startApp();

// const app = express();

// const PORT = 4000;

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   subscriptions: {
//     onConnect: () => console.log('Connected to websocket'),
//   },
//   tracing: true,
// });

// server.applyMiddleware({ app })

// const httpServer = http.createServer(app);
// server.installSubscriptionHandlers(httpServer);

// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
//   console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
// })
