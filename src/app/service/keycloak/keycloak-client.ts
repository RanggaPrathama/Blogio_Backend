import KeycloakAdminClient from "@keycloak/keycloak-admin-client";
import axios from "axios";
import { URLSearchParams } from "url";

export type TokenResponse = {
    access_token: string;
    expires_in: number;
    token_type: string;
}


export type UserKeycloak = {
    id: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
}

export interface KeyCloakPayload {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  exp: number;
  iat: number;
  iss: string;
  aud: string | string[];
}


export class KeyCloakClient {
  private kcAdminClient: KeycloakAdminClient;

  constructor() {
    this.kcAdminClient = new KeycloakAdminClient({
      baseUrl: process.env.KEYCLOAK_BASE_URL || "",
      realmName: process.env.KEYCLOAK_REALM || "",
      requestOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
  }

  async auth(): Promise<void> {
    try {
        await this.kcAdminClient.auth({
            username: process.env.KEYCLOAK_ADMIN_USERNAME || "",
            password: process.env.KEYCLOAK_ADMIN_PASSWORD || "",
            clientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET || "",
            grantType: "client_credentials",
            clientId: process.env.KEYCLOAK_CLIENT_ID || ""
        })
    } catch (error) {
      console.error("Error authenticating Keycloak client:", error);
    }
  }

  public get adminClient():KeycloakAdminClient{
    return this.kcAdminClient;
  }

  async getAccessToken(username:string, password:string){
    try{
        const response = await axios.post(
            `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
            new URLSearchParams({
                client_id: process.env.KEYCLOAK_CLIENT_ID || "",
                client_secret: process.env.KEYCLOAK_CLIENT_SECRET || "",
                grant_type: "password",
                username: username,
                password: password
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )

        if(response.status !== 200){
            console.error("Failed to get access token from Keycloak");
            throw new Error("Failed to get access token from Keycloak");
        }

        return response.data.access_token;
    }catch(error){
      console.error("Error getting access token:", error);
    }
  }

//   async verifyToken = (token:string){

//   }

//   async extractUserFromToken(token: string):Promise<UserKeycloak>{
//      const decodedToken = 
//   }

  
}
