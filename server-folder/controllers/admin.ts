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
import { afterSignupAuth, isAdmin } from '../middlewares/signupAuth';
import { generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { yandexService } from '~/utils/services/yandex.service'
import { findMany, getCount } from '../lib/orm';



export async function deleteActor(req: Request, res: Response, _next: NextFunction) {
  try {
    
    let dataCast = await prisma.cast.deleteMany({
      where: { person_id: req.body.id }
    });
    let data = await prisma.person.delete({
      where: { id: req.body.id }
    });

    if (req.body.page) {
      console.log('req.body,',req.body)
      let cond = {}
      let actors = await findMany(req, 'person', cond)
      let count = await getCount('person', cond)
      return res.json({
        success: true,
        data: actors,
        total: count
      });
    } else {
      return res.json({
        success: true,
      });
    }
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}












// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'delete', path: '/actors', handler: [afterSignupAuth, isAdmin, deleteActor] },



  ],
}

export default routes
