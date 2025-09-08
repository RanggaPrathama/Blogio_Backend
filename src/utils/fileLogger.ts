import * as fs from 'fs';
import * as path from 'path';
import { AbstractLogger, QueryRunner, LogMessage } from 'typeorm';

export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING', 
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  QUERY = 'QUERY',
  QUERY_ERROR = 'QUERY_ERROR',
  QUERY_SLOW = 'QUERY_SLOW'
}

export interface LogData {
  level: LogLevel;
  message: string | number;
  context?: object;
  userId?: string;
  ip?: string;
  userAgent?: string;
  duration?: number;
}

// export type LogMessage = {
//   type?: any;
//   message: string;
//   prefix?: string;
// };

// export type QueryRunner = {
//   // Define the properties and methods for the QueryRunner type
//   startTransaction: () => Promise<void>;
//   commitTransaction: () => Promise<void>;
//   rollbackTransaction: () => Promise<void>;
//   query: (sql: string, parameters?: any[]) => Promise<any>;
// };

export class FileLogger extends AbstractLogger {
  private logDirectory: string;

  constructor(logDirectory: string = 'storage/logs') {
    super();
    this.logDirectory = logDirectory;
    this.ensureLogDirectory();
  }

   protected writeLog(
        level: any,
        logMessage: LogMessage | LogMessage[],
        queryRunner?: QueryRunner,
    ) {
        const messages = this.prepareLogMessages(logMessage, {
            highlightSql: false,
        }, queryRunner)

        for (const message of messages) {

            const logType = message.type ?? level;

            // Log query ke file
            if (logType === 'query' || logType === 'query-error' || logType === 'query-slow') {
             this.logQueryes(message, logType);
            }

            switch (message.type ?? level) {
                case "log":
                case "schema-build":
                case "migration":
                    console.log(message.message)
                    break

                case "info":
                case "query":
                    if (message.prefix) {
                        console.info(message.prefix, message.message)
                    } else {
                        console.info(message.message)
                    }
                    break

                case "warn":
                case "query-slow":
                    if (message.prefix) {
                        console.warn(message.prefix, message.message)
                    } else {
                        console.warn(message.message)
                    }
                    break

                case "error":
                case "query-error":
                    if (message.prefix) {
                        console.error(message.prefix, message.message)
                    } else {
                        console.error(message.message)
                    }
                    break
            }
        }
    }

  private logQueryes(message: LogMessage, type: string): void {
    let level: LogLevel;
    
    switch (type) {
      case 'query':
        level = LogLevel.QUERY;
        break;
      case 'query-error':
        level = LogLevel.QUERY_ERROR;
        break;
      case 'query-slow':
        level = LogLevel.QUERY_SLOW;
        break;
      default:
        level = LogLevel.DEBUG;
    }

    const logData: LogData = {
      level,
      message: message.message
    };

    if (message.prefix) {
      logData.context = { prefix: message.prefix };
    }

    this.logs(logData);
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  private getLogFileName(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDirectory, `blogio-${today}.log`);
  }

  private formatLogEntry(logData: LogData): string {
    const timestamp = new Date().toISOString();
    const context = logData.context ? ` | Context: ${JSON.stringify(logData.context)}` : '';
    const user = logData.userId ? ` | User: ${logData.userId}` : '';
    const ip = logData.ip ? ` | IP: ${logData.ip}` : '';
    
    return `[${timestamp}] ${logData.level}: ${logData.message}${context}${user}${ip}\n`;
  }

  private writeToFile(content: string, isQuery: boolean = false): void {
    const fileName = this.getLogFileName();
    fs.appendFileSync(fileName, content, 'utf8');
  }

  public info(message: string, context?: any, userId?: string, ip?: string): void {
    const logData: LogData = { level: LogLevel.INFO, message };
    if (context !== undefined) logData.context = context;
    if (userId !== undefined) logData.userId = userId;
    if (ip !== undefined) logData.ip = ip;
    this.logs(logData);
  }

  public warning(message: string, context?: any, userId?: string, ip?: string): void {
    const logData: LogData = { level: LogLevel.WARNING, message };
    if (context !== undefined) logData.context = context;
    if (userId !== undefined) logData.userId = userId;
    if (ip !== undefined) logData.ip = ip;
    this.logs(logData);
  }

  public error(message: string, context?: any, userId?: string, ip?: string): void {
    const logData: LogData = { level: LogLevel.ERROR, message };
    if (context !== undefined) logData.context = context;
    if (userId !== undefined) logData.userId = userId;
    if (ip !== undefined) logData.ip = ip;
    this.logs(logData);
  }

  public debug(message: string, context?: any, userId?: string, ip?: string): void {
    const logData: LogData = { level: LogLevel.DEBUG, message };
    if (context !== undefined) logData.context = context;
    if (userId !== undefined) logData.userId = userId;
    if (ip !== undefined) logData.ip = ip;
    this.logs(logData);
  }

    private logs(logData: LogData): void {
    const logEntry = this.formatLogEntry(logData);
    const isQuery = logData.level === LogLevel.QUERY || 
                   logData.level === LogLevel.QUERY_ERROR || 
                   logData.level === LogLevel.QUERY_SLOW;
    
    this.writeToFile(logEntry, isQuery);
    
    // Juga tampilkan di console untuk development
    console.log(logEntry.trim());
  }
}

// Singleton instance
export const logger = new FileLogger();
