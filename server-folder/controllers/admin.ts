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
//@ts-ignore
import { body, validationResult } from 'express-validator';
import { afterSignupAuth, isAdmin } from '../middlewares/signupAuth';
import { generateUniqueString, generateUserTokens } from '../lib/helpers';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { timewebService } from '~/utils/services/timeweb.service'
import { findMany, getCount } from '../lib/orm';

const avatarBody = body('avatar').notEmpty()
const idBody = body('id').notEmpty()


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

export async function updateActor(req: Request, res: Response, _next: NextFunction) {
  try {
    const validationErrors = await getMessages(validationResult(req));
    if (!validationErrors) {
      await prisma.person.update({
        where: { id: req.body.id },
        data: {avatar: req.body.avatar}
      });
      return res.json({
        success: true,
      });
    }
    return errorHandler(createError.BadRequest(validationErrors), req, res)
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export async function createIntuitionPack(req: Request, res: Response, _next: NextFunction) {
  try {
    let {data, pack} = req.body
    let result
    if (data.id) {
      result = await prisma.intuitionPack.update({
        where: { id: data.id },
        data: {
          logo: data.logo,
          name: data.text,
          enable: data.enable,
          fakeActor: data.fakeActor,
          user_id: res.locals.auth.id
        },
      });
    } else {
      result = await prisma.intuitionPack.create({
        data: {
          logo: data.logo,
          name: data.text,
          fakeActor: data.fakeActor,
          enable: data.enable,
          user_id: res.locals.auth.id
        },
      });
    }
    for (let i = 0; i < pack.length; i++) {
      if (pack[i].id) {
        await prisma.intuitionPackContent.update({
          where: {id: pack[i].id},
          data: {
            avatar: pack[i].actor.avatar,
            year: pack[i].year,
            character: pack[i].character,
            actor_id: pack[i].actor.id,
            actorName: pack[i].actor.name,
            text: pack[i].text,
            movie: pack[i].movie,
            pack_id: result.id
          },
        });
      } else {
        await prisma.intuitionPackContent.create({
          data: {
            avatar: pack[i].actor.avatar,
            year: pack[i].year,
            character: pack[i].character,
            actor_id: pack[i].actor.id,
            actorName: pack[i].actor.name,
            text: pack[i].text,
            movie: pack[i].movie,
            pack_id: result.id
          },
        });
      }
    }
      return res.json({
        success: true,
      });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export async function deleteIntuitionPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.intuitionPackContent.deleteMany({
      where: { pack_id: req.body.id }
    });
    await prisma.intuitionPack.delete({
      where: { id: req.body.id }
    });

    if (req.body.page) {
      let cond = {}
      let actors = await findMany(req, 'intuitionPack', cond)
      let count = await getCount('intuitionPack', cond)
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

export async function deleteIntuitionItemPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.intuitionPackContent.deleteMany({
      where: { id: req.body.id }
    });
    return res.json({
      success: true,
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

export async function uploadImage(req: Request, ress: Response, _next: NextFunction) {
  try {
    if (req.file) {
      let name = generateUniqueString() + '.' + req.file.originalname.split('.')[1]
      let upload = await timewebService.uploadFile(req.file, req.body.type, name)
      console.log('upload',upload)
      return ress.json({
        success: true,
        data: upload
      });
    } else {
      return ress.json({
        success: false,
      });
    }
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}











// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'delete', path: '/actors', handler: [afterSignupAuth, isAdmin, deleteActor] },
    { method: 'post', path: '/actors', handler: [avatarBody, idBody, afterSignupAuth, isAdmin, updateActor] },
    { method: 'post', path: '/intuition', handler: [afterSignupAuth, isAdmin, createIntuitionPack] },
    { method: 'delete', path: '/intuition', handler: [afterSignupAuth, isAdmin, deleteIntuitionPack] },
    { method: 'delete', path: '/intuitionItem', handler: [afterSignupAuth, isAdmin, deleteIntuitionItemPack] },
    { method: 'post', path: '/upload', handler: [afterSignupAuth, isAdmin, upload.single('file'), uploadImage] },


  ],
}

export default routes
