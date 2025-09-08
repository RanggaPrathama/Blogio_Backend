export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    errors?: string[];
    message?: string;
}
export declare class ResponseUtil {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error(errors: string[], message?: string): ApiResponse<null>;
}
//# sourceMappingURL=response.d.ts.map