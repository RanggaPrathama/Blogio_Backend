import { User } from "../types/object/user.object.js";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

export type BodyToken = {
  userId: string;
  username: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
};

export class JsonWebToken {
  static sign(body: User, isAccessToken: boolean): string {
    let token = "";

    if (isAccessToken) {
      token = jwt.sign(
        {
          userId: body.id,
          username: body.username,
          email: body.email,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1h", algorithm: "HS256" }
      );
    } else {
      token = jwt.sign(
        {
          userId: body.id,
          username: body.username,
          email: body.email,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d", algorithm: "HS256" }
      );
    }

    return token;
  }

  /**
   * Verify dan decode JWT token
   */
  static verify(token: string, isAccessToken: boolean): BodyToken {
    try {
      let decoded = null;
      if (isAccessToken) {
        decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as BodyToken;
      } else {
        decoded = jwt.verify(
          token,
          process.env.REFRESH_TOKEN_SECRET as string
        ) as BodyToken;
      }
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new GraphQLError("Token has expired", {
          extensions: {
            code: "TOKEN_EXPIRED",
            http: { status: 401 },
          },
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new GraphQLError("Invalid token", {
          extensions: {
            code: "INVALID_TOKEN",
            http: { status: 401 },
          },
        });
      }

      throw new GraphQLError("Token verification failed", {
        extensions: {
          code: "TOKEN_VERIFICATION_FAILED",
          http: { status: 401 },
        },
      });
    }
  }

  /**
   * Extract Bearer token dari Authorization header
   */
  static extractBearerToken(authorization?: string): string | null {
    if (!authorization) return null;

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1] || null;
  }
}
