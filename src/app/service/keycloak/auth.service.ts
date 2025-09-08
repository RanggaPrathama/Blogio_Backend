import {KeyCloakClient} from "./keycloak-client.js";
import { Inject, Service } from "typedi";
import jwt from "jsonwebtoken";


@Service()
export class AuthServiceKeycloak{
    
    //private keycloakAdmin: KeycloakAdminClient;
    constructor(
        @Inject()
       private keycloakAdmin: KeyCloakClient
    ){
       
        // this.keycloakAdmin = new KeycloakAdminClient({
        //     baseUrl: process.env.KEYCLOAK_BASE_URL || "",
        //     realmName: process.env.KEYCLOAK_REALM || "",
        //     requestOptions:{
        //         headers:{
        //             "Content-Type": "application/json"
        //         }
        //     }
        // })
    }

    
    // Login User With Keycloak

    async LoginUser(username: string, password:string){
        try{
            const tokenResponse = await this.keycloakAdmin.getAccessToken(username, password);
            return tokenResponse
        }catch(error){
            console.error("Login failed:", error);
            throw new Error("Login failed");
        }
    }
    


    /*
    * Register a new user in Keycloak
    */
    async registerUser(userData:{
        username:string,
        password:string,
        firstname:string,
        lastname:string
    }){
        try{
            await this.keycloakAdmin.auth();

            const existingDataUser = await this.keycloakAdmin.adminClient.users.find({
                username:userData.username,
                realm: process.env.KEYCLOAK_REALM || ""
            })

            if(existingDataUser.length > 0) throw new Error("User already exists")

            await this.keycloakAdmin.adminClient.users.create({
                realm: process.env.KEYCLOAK_REALM || "",
                ...userData
            })

            return {
                message: "User registered successfully",
                user: {
                    username: userData.username,
                    firstname: userData.firstname,
                    lastname: userData.lastname
                }
            }


        }catch(error){
            console.error(error);
            throw new Error('User registration failed');
        }
    }


    /*
    * Login a user in Keycloak
    */
//     async loginUser(username: string, password: string) {
//     try {
//       const tokenResponse = await fetch('http://localhost:8080/realms/blogio/protocol/openid-connect/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           grant_type: 'password',
//           client_id: 'blogio-backend',
//           username,
//           password,
//         }),
//       });

//       if (!tokenResponse.ok) {
//         throw new Error('Invalid credentials');
//       }

//       const tokens = await tokenResponse.json();
//       return tokens;
//     } catch (error) {
//       throw new Error(`Login failed: ${error}`);
//     }
//   }

    verifyToken(token: string) {
    try {
      // Decode without verification (Keycloak handles verification)
      const decoded = jwt.decode(token, { complete: true });
      return decoded?.payload;
    } catch (error) {
      console.error(error);
      throw new Error('Invalid token');
    }
  }



    
    
}