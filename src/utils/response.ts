export interface ApiResponse<T> {
    success:boolean;
    data?: T;
    errors?: string[];
    message?: string;
}

export class ResponseUtil{
    static success<T>(data:T, message:string = "success"): ApiResponse<T> {
        return {
            success: true,
            data,
            message
        };
    }

    static error(errors:string[], message:string = "error"): ApiResponse<null> {
        return {
            success: false,
            errors,
            message
        };
    }
}



