import { BodyToken } from "@/utils/jwt.js";

 export interface AuthContext {
   req: {
     headers: {
       authorization?: string;
     };
   };
   user?: BodyToken;
   cookies?: {
     get: (name: string) => string | undefined;
     set: (name: string, value: string, options?: any) => void;
   };
 }