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
const imageBody = body('image').notEmpty()


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

export async function updateMovie(req: Request, res: Response, _next: NextFunction) {
  try {
    const validationErrors = await getMessages(validationResult(req));
    if (!validationErrors) {
      await prisma.movie.update({
        where: { id: req.body.id },
        data: {image: req.body.image}
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

export async function createCastPack(req: Request, res: Response, _next: NextFunction) {
  try {
    let {data, pack} = req.body
    let result
    let payloadPack = {
      logo: data.logo,
      name: data.text,
      enable: data.enable,
      user_id: res.locals.auth.id
    }
    if (data.id) {
      result = await prisma.castPack.update({
        where: { id: data.id },
        data: payloadPack,
      });
    } else {
      result = await prisma.castPack.create({
        data: payloadPack,
      });
    }
    for (let i = 0; i < pack.length; i++) {
      let payloadCont = {
        movie_id: pack[i].movie.id,
        actor1: pack[i].actor1.avatar,
        actor2: pack[i].actor2.avatar,
        actor3: pack[i].actor3.avatar,
        actor4: pack[i].actor4.avatar,
        actor5: pack[i].actor5.avatar,
        actor6: pack[i].actor6.avatar,
        actor7: pack[i].actor7.avatar,
        actor8: pack[i].actor8.avatar,
        pack_id: result.id
      }
      if (pack[i].id) {
        await prisma.castPackContent.update({
          where: {id: pack[i].id},
          data: payloadCont,
        });
      } else {
        await prisma.castPackContent.create({
          data: payloadCont,
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

export async function deleteCastPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.castPackContent.deleteMany({
      where: { pack_id: req.body.id }
    });
    await prisma.castPack.delete({
      where: { id: req.body.id }
    });

    if (req.body.page) {
      let cond = {}
      let actors = await findMany(req, 'castPack', cond)
      let count = await getCount('castPack', cond)
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

export async function deleteCastItemPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.castPackContent.deleteMany({
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


export async function createQuizPack(req: Request, res: Response, _next: NextFunction) {
  try {
    let {data, pack} = req.body
    let result
    if (data.id) {
      result = await prisma.quizPack.update({
        where: { id: data.id },
        data: {
          logo: data.logo,
          name: data.text,
          enable: data.enable,
          user_id: res.locals.auth.id
        },
      });
    } else {
      result = await prisma.quizPack.create({
        data: {
          logo: data.logo,
          name: data.text,
          enable: data.enable,
          user_id: res.locals.auth.id
        },
      });
    }
    for (let i = 0; i < pack.length; i++) {
      let data: any =  {
        text: pack[i].text,
        number: pack[i].number,
        position: pack[i].position,
        enable: pack[i].enable,
        score: pack[i].score,
        time: parseInt(pack[i].time),
        image: pack[i].image,
        answerImage: pack[i].answerImage,
        video: pack[i].video,
        audio: pack[i].audio,
        abcd: pack[i].abcd,
        comparison: pack[i].comparison,
        order: pack[i].order,
        manyAnswers: pack[i].manyAnswers,
        isComparisonImage: pack[i].isComparisonImage,
        slide: pack[i].slide,
        slideTime: parseInt(pack[i].slideTime),
        isSlideBtn: pack[i].isSlideBtn,
        type: pack[i].type.id,
        libraryType: pack[i].libraryType.id,
        pack_id: result.id
      }
      if (pack[i].answer_id) {
        data.answer_id = pack[i].answer_id.id
      }
      if (pack[i].id) {
        await prisma.quizPackRound.update({
          where: {id: pack[i].id},
          data,
        });
      } else {
        await prisma.quizPackRound.create({
          data,
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

export async function deleteQuizPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.quizPackRound.deleteMany({
      where: { pack_id: req.body.id }
    });
    await prisma.quizPack.delete({
      where: { id: req.body.id }
    });

    if (req.body.page) {
      let cond = {}
      let actors = await findMany(req, 'quizPack', cond)
      let count = await getCount('quizPack', cond)
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

export async function deleteQuizItemPack(req: Request, res: Response, _next: NextFunction) {
  try {
    await prisma.quizPackRound.deleteMany({
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



export async function uploadFile(req: Request, ress: Response, _next: NextFunction) {
  try {
    if (req.file) {
      let name = generateUniqueString() + '.' + req.file.originalname.split('.')[1]
      let upload = await timewebService.uploadFile(req.file, req.body.type, name)
      if (req.body.toDelete) {
        await timewebService.removeFile(req.body.toDelete, req.body.type)
      }
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


export async function addImage(req: Request, ress: Response, _next: NextFunction) {
  try {
    await prisma.libraryImage.create({
      data: {link: req.body.image, library_id: parseInt(req.body.id)},
    });
    return ress.json({
      success: true,
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}



export async function deleteImage(req: Request, ress: Response, _next: NextFunction) {
  try {
   await prisma.libraryImage.deleteMany({
      where: {library_id: parseInt(req.body.id), link: req.body.image},
    });
    await timewebService.removeFile(req.body.image, req.body.folder)
    return ress.json({
      success: true,
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}

export async function addSlide(req: Request, ress: Response, _next: NextFunction) {
  try {
    if (req.body.id) {
      await prisma.slides.update({
        where: {id: req.body.id},
        data: {content: req.body.content, name: req.body.name},
      });
    } else {
      await prisma.slides.create({
        data: {content: req.body.content, name: req.body.name},
      });
    }
    let data = await prisma.slides.findMany({
      where: {},
    });
   
    return ress.json({
      success: true,
      data
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}

export async function getSlides(req: Request, ress: Response, _next: NextFunction) {
  try {
   let data = await prisma.slides.findMany({
      where: {},
    });
   
    return ress.json({
      success: true,
      data
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}

export async function deleteSlide(req: Request, ress: Response, _next: NextFunction) {
  try {
    await prisma.slides.delete({
      where: {id: req.body.id},
    });
  
    let data = await prisma.slides.findMany({
      where: {},
    });
    return ress.json({
      success: true,
      data
    });
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, ress)
  }
}

export async function moveRound(req: Request, ress: Response, _next: NextFunction) {
  try {
    let count: any = await getCount('quizPackRound', {pack_id: req.body.packId})
    await prisma.quizPackRound.update({
      where: { id: req.body.roundId }, data: { pack_id: req.body.packId, number: -1, position: (count+1), enable: false}
    });
    return ress.json({
      success: true,
    });
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
    { method: 'post', path: '/movie', handler: [imageBody, idBody, afterSignupAuth, isAdmin, updateMovie] },
    { method: 'post', path: '/intuition', handler: [afterSignupAuth, isAdmin, createIntuitionPack] },
    { method: 'delete', path: '/intuition', handler: [afterSignupAuth, isAdmin, deleteIntuitionPack] },
    { method: 'delete', path: '/intuitionItem', handler: [afterSignupAuth, isAdmin, deleteIntuitionItemPack] },
    { method: 'post', path: '/cast', handler: [afterSignupAuth, isAdmin, createCastPack] },
    { method: 'delete', path: '/cast', handler: [afterSignupAuth, isAdmin, deleteCastPack] },
    { method: 'delete', path: '/castItem', handler: [afterSignupAuth, isAdmin, deleteCastItemPack] },
    { method: 'post', path: '/quiz', handler: [afterSignupAuth, isAdmin, createQuizPack] },
    { method: 'delete', path: '/quiz', handler: [afterSignupAuth, isAdmin, deleteQuizPack] },
    { method: 'delete', path: '/quizItem', handler: [afterSignupAuth, isAdmin, deleteQuizItemPack] },
    { method: 'post', path: '/upload', handler: [afterSignupAuth, upload.single('file'), uploadFile] },
    { method: 'post', path: '/image', handler: [afterSignupAuth, isAdmin, addImage] },
    { method: 'delete', path: '/image', handler: [afterSignupAuth, isAdmin, deleteImage] },
    { method: 'get', path: '/slide', handler: [afterSignupAuth, isAdmin, getSlides] },
    { method: 'post', path: '/slide', handler: [afterSignupAuth, isAdmin, addSlide] },
    { method: 'delete', path: '/slide', handler: [afterSignupAuth, isAdmin, deleteSlide] },
    { method: 'post', path: '/moveRound', handler: [afterSignupAuth, isAdmin, moveRound] },

    
  ],
}

export default routes
