import { AbstractLogger, QueryRunner, LogMessage } from 'typeorm';
export declare enum LogLevel {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
    QUERY = "QUERY",
    QUERY_ERROR = "QUERY_ERROR",
    QUERY_SLOW = "QUERY_SLOW"
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
export declare class FileLogger extends AbstractLogger {
    private logDirectory;
    constructor(logDirectory?: string);
    protected writeLog(level: any, logMessage: LogMessage | LogMessage[], queryRunner?: QueryRunner): void;
    private logQueryes;
    private ensureLogDirectory;
    private getLogFileName;
    private formatLogEntry;
    private writeToFile;
    info(message: string, context?: any, userId?: string, ip?: string): void;
    warning(message: string, context?: any, userId?: string, ip?: string): void;
    error(message: string, context?: any, userId?: string, ip?: string): void;
    debug(message: string, context?: any, userId?: string, ip?: string): void;
    private logs;
}
export declare const logger: FileLogger;
//# sourceMappingURL=fileLogger.d.ts.map