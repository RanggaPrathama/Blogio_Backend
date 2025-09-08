import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { GraphQLSchema } from "graphql";
import type http from 'http'
import { AuthContext } from "../context/AppContext.js";

export const createApolloServer= async (httpServer:http.Server, schema:GraphQLSchema) => {
   
     const server = new ApolloServer<AuthContext>({
    schema,
    introspection: true,
    plugins:[ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: formattedError => {
      return {
        ...formattedError,
        message: formattedError.message,
        extensions: formattedError.extensions || {},
        locations: formattedError.locations ?? [],
        path: formattedError.path ?? [],
      }
    }
  });

  await server.start();

  return server
}