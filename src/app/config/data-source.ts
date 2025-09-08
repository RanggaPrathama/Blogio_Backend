
import { User } from "../../database/entities/User.js";
import { Tag } from "../../database/entities/Tags.js";
import { Article } from "../../database/entities/Article.js";
import { logger } from "../../utils/fileLogger.js";
import { DataSource, type DataSourceOptions } from 'typeorm'
import "dotenv/config";


const options:DataSourceOptions= {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_DATABASE || "blogio",
  entities: [User, Tag, Article],
  synchronize: true,
  logging: true,
  logger: logger,
}

export const AppDataSource = new DataSource(options)


export const TestConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Error establishing database connection:", error);
  }
};

