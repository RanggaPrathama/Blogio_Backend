import "dotenv/config";

export class AppConfig {

  public readonly port = process.env.PORT;
  public readonly dbHost = process.env.DB_HOST;
  public readonly dbPort = process.env.DB_PORT;
  public readonly dbUsername = process.env.DB_USERNAME;
  public readonly dbPassword = process.env.DB_PASSWORD;
  public readonly dbDatabase = process.env.DB_DATABASE;

  public readonly nodeEnv = process.env.NODE_ENV;
}

