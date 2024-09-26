import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { afterSignupAuth, isAdmin } from '../middlewares/signupAuth';
import { findMany, getCount } from '../lib/orm';




export async function saveStats(req: Request, res: Response, _next: NextFunction) {
  try {
    let { log, value, pack_id } = req.body
    let logParsed = JSON.parse(log)
    let isExist = await prisma.intuitionResult.findFirst({
      where: {
        pack_id: pack_id,
        user_id: res.locals.auth.id
      }
    })
    let result = 'exist'
    if (!isExist) {
      result = await prisma.intuitionResult.create({
        data: {
          value: value,
          time: logParsed[logParsed.length-1].date - logParsed[0].date,
          log: log,
          pack_id: pack_id,
          user_id: res.locals.auth.id
        },
      });
    }
    
    return res.json({
      success: true,
      data: result,
    });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/intuition', handler: [afterSignupAuth, saveStats] },


  ],
}

export default routes
