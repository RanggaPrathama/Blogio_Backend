import express, { RequestHandler } from "express";
import { expressMiddleware } from "@as-integrations/express4";
import "dotenv/config";
import cors from "cors";
import { schemaHelper } from "./app/schema/schema.js";
import { createApolloServer } from "./app/config/apollo-server.js";
import http from "http";
import dotenv from "dotenv";
import { AppDataSource } from "./app/config/data-source.js";
import { logger } from "./utils/fileLogger.js";
import { ColorsTerminals } from "./types/general.js";
import { graphqlUploadKoa } from 'graphql-upload-ts';

export type Server = {
  app: express.Application;
  serverHttp: http.Server;
  graphqlUrl: string;
};

dotenv.config();

export const createServerLocal = async (): Promise<Server> => {
  const port = process.env.PORT || 4000;
  const host = process.env.HOST || "localhost";
  const graphqlUrl = `http://${host}:${port}/graphql`;

  try {
    await AppDataSource.initialize();
    console.log(ColorsTerminals.logSuccess("Database Connected successfully"));
  } catch (error) {
    logger.error("Error connecting to the database", { error });
    console.error(ColorsTerminals.logError("Error connecting to the database"));
  }

  const app = express();

  const schema = await schemaHelper();
  const server = http.createServer(app);
  const apolloServer = await createApolloServer(server, schema);

  app.use(
    cors({ origin: "*" }),
    express.json({ limit: "10mb" }),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        req: {
          headers: {
            authorization: req.headers.authorization || "",
          },
          cookies:{
            get: (name: string) => req.cookies ? req.cookies[name] : undefined,
          }
        },
      }),
    }) as RequestHandler
  );

  app.use(
    graphqlUploadKoa({
      maxFileSize: 5 * 1024 * 1024, // 5 MB
      maxFiles: 10,
    })
  )

  return {
    app: app,
    serverHttp: server,
    graphqlUrl: graphqlUrl,
  };
};
