import { buildSchema } from "type-graphql"
import { resolvers } from '../graphql/resolvers/index.js';
//import path from "path";
import { Container } from "typedi";
import { AuthChecker } from "src/app/middleware/auth.js";


export const schemaHelper = async() => {
    return await buildSchema({
        resolvers: resolvers,
        // emitSchemaFile: path.resolve(__dirname, "/src/database/schema/schema.graphql"),     
        validate: true, 
        // container: {
        //   get: (cls) => Container.get(cls),
        // },
        container: Container,
        authChecker: AuthChecker,
      });
}