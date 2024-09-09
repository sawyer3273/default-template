import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import md5 from "md5"
import Cookie from 'cookie'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { sendEmail } from '~/utils/email';
import { body, validationResult, query } from 'express-validator';
import { getMessages } from "../lib/validation";
import { afterSignupAuth } from '../middlewares/signupAuth';
import { generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { yandexService } from '~/utils/services/yandex.service'

const emailValid =  body('email').isEmail().withMessage('Not a valid e-mail address');
const usernamelValid =  body('username').notEmpty().withMessage('Not a valid username');
const passwordlValid = body('password').notEmpty().withMessage('Not a valid password');
const tokenValidBody = body('token').notEmpty()
const tokenValid = query('token').notEmpty()



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

      
      return res.json({
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
          user: {
            email: user.email, 
            isEmailVerified: user.isEmailVerified, 
            rate: user.rate, 
            role: user.role, 
            username: user.username, 
            token
          }
        })
      }
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const loginYandex = async (req: Request, res: Response, next: Function) => {
  try {
    const Yatoken = req.body.token;
    let yandexUser = await yandexService.getYandexUser(Yatoken)
    let user;
    if (yandexUser && yandexUser.login && yandexUser.default_email) {
      user = await prisma.user.findFirst({
        where: {
          email: {equals: yandexUser.default_email}
        },
      });
    } else {
      throw createError(400, "Failed to get Yandex ID")
    }
    if (!user) {
      let result = await prisma.user.create({
        data: {
          username: yandexUser.login,
          email: yandexUser.default_email,
          password: yandexUser.psuid,
        },
      });
      console.log('result',result)
      user = await prisma.user.findFirst({
        where: {
          email: {equals: yandexUser.default_email}
        },
      });
    } 
    //@ts-ignore
    let token = await generateUserTokens(user, req, res)
    res.json({
      success: true,
      user: {
        //@ts-ignore
        email: user.email, 
        //@ts-ignore
        isEmailVerified: user.isEmailVerified, 
        //@ts-ignore
        rate: user.rate, 
        //@ts-ignore
        role: user.role, 
        //@ts-ignore
        username: user.username, 
        token
      }
    })
    
  } catch (error) {
    return errorHandler(error, req, res)
  }
};


export const logout = async (req: any, res: Response, next: Function) => {
  try {
      let data = await prisma.userAuthTokens.deleteMany({
        where: { fingerprint: req.fingerprint.hash, user_id: res.locals.auth.id }
      });
      res.json({
        success: true,
        data
      })
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
    throw createError(401, req.t("userNotFound"))
    
    
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
      let data = await prisma.user.update({
        where: { id: user.id },
        data: {
          forgotToken: generate,
        },
      });
      let pwResetLink = `${process.env.baseURL}/reset-password/${generate}`
      let result = await sendEmail(
        user.email,
        req.t("resetPass"),
        `${req.t("followToReset")}${pwResetLink}`,
      )
      
      return res.status(200).json({
          success: true,
          frontMessage: true,
          message: req.t("recoverySent")
      })
    } else {
      return res.json(createError.BadRequest("Email is Required"));
    }
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const checkForgotToken = async (req: any, res: Response, next: Function) => {
  try {
    let user = await prisma.user.findFirst({
      where: {
        forgotToken: {equals: req.query.token}
      },
    });
    if (user) {
      return res.status(200).json({
        success: true,
      })
    } else {
      throw createError.BadRequest("Wrong token");
    }
  } catch (error: any) {
    //error.hideFrontMessage = true
    return errorHandler(error, req, res)
  }
};

export const updatePassword = async (req: any, res: Response, next: Function) => {
  try {
    const validationErrors = await getMessages(validationResult(req));
    if (validationErrors) {
      throw createError.BadRequest(validationErrors)
    } 
    const { token, password } = req.body;
    let user = await prisma.user.findFirst({
      where: {
        forgotToken: token
      },
    });
    if (!user) {
      throw createError.BadRequest("User not Found")
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await encryptPassword(password),
        forgotToken: ''
      },
    });
    return res.status(200).json({
      success: true,
    })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

export const getUser = async (req: any, res: Response, next: Function) => {
  try {
      return res.status(200).json({
          success: true,
          message: 'Recovery email sent'
      })
  } catch (error) {
    return errorHandler(error, req, res)
  }
};

//test route
export const customRoute = async (req: Request, res: Response, next: Function) => {
  try {
    const file = req.file
    let folderName = 'test'
    if (file) {
      let link = await yandexService.getUploadLink(encodeURIComponent(`/${folderName}/${file.originalname}`))
      if (link.href) {
        let send = await yandexService.uploadFile(link.href, file)
      }
    }
    return res.json({
        success: true,
        message: 'test'
    })
  } catch (error) {
    console.log('error',error)
    return errorHandler(error, req, res)
  }
};







// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/register', handler: [emailValid, passwordlValid, usernamelValid, register] },
    { method: 'post', path: '/login', handler: login },
    { method: 'post', path: '/loginYandex', handler: loginYandex },
    { method: 'post', path: '/logout', handler: [afterSignupAuth, logout] },
    { method: 'post', path: '/refreshToken', handler: refreshToken },
    { method: 'post', path: '/forgot', handler: forgot },
    { method: 'get', path: '/checkForgotToken', handler: [tokenValid, checkForgotToken] },
    { method: 'post', path: '/updatePassword', handler: [passwordlValid, tokenValidBody, updatePassword] },
    { method: 'get', path: '/', handler: getUser },
    { method: 'post', path: '/customRoute', handler: [afterSignupAuth, upload.single('file'), customRoute] },



  ],
}

export default routes
