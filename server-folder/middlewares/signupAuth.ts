import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import Cookie from 'cookie'
import type { NextFunction, Request, Response } from "express";
import { ERROR_EXPIRED } from "~/constants";
import prisma from "~/tools/prisma";
import type { UserDataType } from "~/types/indexType";
import { generateUserTokens } from "../lib/helpers";
export const SECRET_KEY: Secret = `${process.env.ACCESS_TOKEN_SECRET}`;


export const afterSignupAuth = async (req: any, res: Response, next: NextFunction) => {
  console.log('req.headers',req.headers.authorization)
  console.log('req.headers.cookie',req.headers.cookie)
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization; //req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err: any, decode: any) => {
      if (err) {
        console.log('invalid token 1')
        return res.status(401).json({
            success: false,
            message: 'Invalid access token',
            type: ERROR_EXPIRED,
        })
      } else {
        console.log('decode',decode)
        let now = new Date().getTime() / 1000
        let left = decode.exp - now 
        if (left < 5) {
          return res.status(401).json({
            success: false,
            message: 'Token is expired',
            type: ERROR_EXPIRED,
          })
        }

        let isAuth = await checkAuthorization({...decode, token}, req)
        if (!isAuth) {
          return res.status(401).json({
            success: false,
            message: 'Token not found',
            type: ERROR_EXPIRED,
          })
        }
        res.locals.auth = {
            id: decode.userId,
            username: decode.username,
            userEmail: decode.userEmail,
         }
        next()        
      }
    })
  }  else {
    return res.status(401).json({
      success: false,
      message: 'It is private function. Please add authorization header'
    })
  }
}

export const checkAuthorization = async (user: UserDataType, req: any) => {
  let token = await prisma.userAuthTokens.findFirst({
      where: {
          id: user.id,
          fingerprint: req.fingerprint.hash,
          accessToken: user.token
      }
  })
  console.log('ttokentokentokenoken', token)
   if (!token) {
      return false
   } else {
      return true
   }
}

const checkRefresh = async (req: any, res: any, token: string) => {
    var cookie = req.headers.cookie ? Cookie.parse(req.headers.cookie) : {}
    let success = true
    if (!cookie.refreshToken) {
      
      success = false
    }
    console.log('cookie',cookie.refreshToken)
    console.log('req.fingerprint.hash,req.fingerprint.hash',req.fingerprint.hash)
    let tokenInDb = await prisma.userAuthTokens.findFirst({
      where: {
          fingerprint: req.fingerprint.hash,
          refreshToken: cookie.refreshToken
      }})

    if (tokenInDb.fingerprint == req.fingerprint.hash) {
      let user = await prisma.user.findFirst({
        where: {
          id: {equals: tokenInDb.user_id}
        },
      });
      if (!user) {
        success = false
      } else {
        let token = await generateUserTokens(user, req, res)
        return token
      }
      
    } else {
      success = false
    }
    /*

    await prisma.userAuthTokens.deleteMany({
          where: { accessToken: token }
        });

        */

    if (!success) {
      await prisma.userAuthTokens.deleteMany({
        where: { accessToken: token }
      });
      return false
    } else {
      return true
    }
}