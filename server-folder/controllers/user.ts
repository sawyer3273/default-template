import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import md5 from "md5"
import Cookie from 'cookie'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { sendEmail } from '~/utils/email';
import { body, validationResult } from 'express-validator';
import { getMessages } from "../lib/validation";
import { afterSignupAuth } from '../middlewares/signupAuth';
import { generateUserTokens } from '../lib/helpers';
import type { User } from '@prisma/client';

const emailValid =  body('email').isEmail().withMessage('Not a valid e-mail address');
const usernamelValid =  body('username').notEmpty().withMessage('Not a valid username');
const passwordlValid = body('password').notEmpty().withMessage('Not a valid password');

export async function register(req: Request, res: Response, _next: NextFunction) {
  try {
    const { email, username, password } = req.body;

    const validationErrors = await getMessages(validationResult(req));
    if (!validationErrors) {
      console.log('req.body', req.body)
      let userObj = await prisma.user.findFirst({
        where: {
          OR: [  
            {  email: email },
            {  username: username },
          ]}
      });

      if (userObj) {
        return errorHandler(createError(400, req.t("userAlreadyEixists")), req, res)
      }

      let result = await prisma.user.create({
        data: {
          username: username,
          email: email,
          password: await encryptPassword(password),
        },
      });

      
      res.json({
        success: true,
        frontMessage: true,
        message: req.t("userCreated")
      });
    }

    return errorHandler(createError.BadRequest(validationErrors), req, res)
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export const login = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body;
    let user;
    if (email) {
      user = await prisma.user.findFirst({
        where: {
          email: {equals: email}
        },
      });
    } else {
      throw createError(400, "Email is Required")
    }
    if (!user) {
      throw createError(400, req.t("userNotFound"))
    } else {
      const match = await isPasswordMatch(password, user.password);
      if (!match) {
        throw createError.Unauthorized(req.t("userNotFound"));
      } else {
        let token = await generateUserTokens(user, req, res)
        res.json({
          success: true,
          user: {...user, token}
        })
      }
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const refreshToken = async (req: any, res: Response, next: Function) => {
  try {
    var cookie = req.headers.cookie ? Cookie.parse(req.headers.cookie) : {}
    let tokenInDb;
    let user
    let success = true
    if (cookie.refreshToken) {
      tokenInDb = await prisma.userAuthTokens.findFirst({
        where: {
          refreshToken: {equals: cookie.refreshToken}
        },
      });

      if (!tokenInDb) {
        success = false
      }
      if (tokenInDb && tokenInDb.fingerprint == req.fingerprint.hash) {
        user = await prisma.user.findFirst({
          where: {
            id: {equals: tokenInDb.user_id}
          },
        });
        if (!user) {
          success = false
        } else {
          let token = await generateUserTokens(user, req, res)
          return res.json({
            success: true,
            user: {...user, token}
          })
        }
        
      } else {
        success = false
      }

    } else {
      success = false
    }
    throw createError(400, req.t("userNotFound"))
    
    
  } catch (error) {
    return errorHandler(error, req, res)
  }
};



export const forgot = async (req: Request, res: Response, next: Function) => {
  try {
    let email = req.body.email;
    let THIRDTEEN_MINUTES = new Date().getTime() + 1800000;
    if (email) {
      let user = await prisma.user.findFirst({
        where: {
          email: email
        },
      });
      if (!user) {
        throw createError(400, "User not Found")
      }
      //@ts-ignore
      let generate = md5(THIRDTEEN_MINUTES)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          forgotToken: generate,
        },
      });
      let pwResetLink = `${process.env.baseURL}/reset-password/${generate}`
      let result = await sendEmail(
        user.email,
        `Follow this link to reset password ${pwResetLink}`,
        "Восстановление пароля",
      )
      console.log('result',result)
      return res.status(200).json({
          success: true,
          message: 'Recovery email sent'
      })
    } else {
      return res.json(createError.BadRequest("Email is Required"));
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const getUser = async (req: any, res: Response, next: Function) => {
  try {
    console.log(req.fingerprint)
    console.log(req.fingerprint.components.useragent)
      return res.status(200).json({
          success: true,
          message: 'Recovery email sent'
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const privatF = async (req: Request, res: Response, next: Function) => {
  try {
      return res.json({
          success: true,
          message: 'privatet'
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};







// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/register', handler: [emailValid, passwordlValid, usernamelValid, register] },
    { method: 'post', path: '/login', handler: login },
    { method: 'post', path: '/refreshToken', handler: refreshToken },
    { method: 'post', path: '/forgot', handler: forgot },
    { method: 'get', path: '/', handler: getUser },
    { method: 'get', path: '/private', handler: [afterSignupAuth ,privatF] },



  ],
}

export default routes
