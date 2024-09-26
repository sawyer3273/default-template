import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import md5 from "md5"
import Cookie from 'cookie'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { sendEmail } from '~/utils/email';
import { getMessages } from "../lib/validation";
import { afterSignupAuth, isAdmin } from '../middlewares/signupAuth';
import { generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { findMany, getCount } from '../lib/orm';




export async function getActors(req: Request, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.key) {
      cond.name = { contains: req.query.key, mode: 'insensitive',}
    }
    let actors = await findMany(req, 'person', cond)
    let count = await getCount('person', cond)
    
    return res.json({
      success: true,
      data: actors,
      total: count
    });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}


export async function getPacksIntuition(req: any, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.id) {
      cond.id = parseInt(req.query.id)
    }
    let include: any = {IntuitionPackContent: true}
    if (res.locals.auth.userRole == 'USER') {
      include.IntuitionResult = {
        where: {
          user_id: res.locals.auth.userId
        }
      }
      cond.enable = true
    }
    let data = await findMany(req, 'intuitionPack', cond, include)
    let count = await getCount('intuitionPack', cond)
    
    return res.json({
      success: true,
      data: data,
      total: count
    });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}



// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'get', path: '/actors', handler: [afterSignupAuth, isAdmin, getActors] },
    { method: 'get', path: '/packsIntuition', handler: [ afterSignupAuth, getPacksIntuition ] },



  ],
}

export default routes
