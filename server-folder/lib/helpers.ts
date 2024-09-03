import type { User } from "@prisma/client";
import prisma from "~/tools/prisma";
import type { Request, Response } from "express";
import type { UserDataType } from "~/types/indexType";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import createError from "http-errors";

export type CustomRequest = Request & {
  email: string | JwtPayload;
};

export const SECRET_KEY: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;

export const signAccessToken = (payload: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload.data,
      payload.tokenType,
      { expiresIn: payload.expiresIn },
      (err: any, token: any) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization; //req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!authHeader) {
    return next(createError.Unauthorized("Access token is required"));
  }
  if (!token) return next(createError.Unauthorized()); //res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err: any, decoded: any) => {
    if (err) return next(createError.Forbidden()); //res.sendStatus(403);
    (req as CustomRequest).email = decoded.email;
    next();
  });
};


export const generateUserTokens = async (user: User, req: any, res: Response) => {
    const userId = user.id;
    const username = user.username;
    const userEmail = user.email;
    const payloadAccess = {
      data: { userId, username, userEmail },
      tokenType: `${process.env.ACCESS_TOKEN_SECRET}`,
      expiresIn: 1000 * 60 * 5, // 5 minutes
    };

    const accessToken = await signAccessToken(payloadAccess);

    const payloadRefresh = {
      data: { userId, username, userEmail },
      tokenType: `${process.env.REFRESH_TOKEN_SECRET}`,
      expiresIn: "7d",
    };

    const refreshToken = await signAccessToken(payloadRefresh);
    
    if (accessToken && refreshToken) {
      await prisma.userAuthTokens.deleteMany({
        where: { fingerprint: req.fingerprint.hash }
      });
      await prisma.userAuthTokens.create({
        data: { 
            user_id:         user.id,
            //@ts-ignore
            refreshToken:    refreshToken,
            //@ts-ignore
            accessToken:     accessToken,
            ua:              JSON.stringify(req.fingerprint.components.useragent),
            fingerprint:     req.fingerprint.hash,
            expiresIn:       new Date().getTime() / 1000 + 24 * 60 * 60  * 7, //7 days 
         }
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 * 7, //7 days 
      });
    }
    return accessToken
}

