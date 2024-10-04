import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import createError from "http-errors";
import md5 from "md5"
import Cookie from 'cookie'
import { errorHandler } from '../middlewares/errorHandler';
import prisma from "../../tools/prisma";
import { generateUniqueString, generateUserTokens } from '../lib/helpers';
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";
import { sendEmail } from '~/utils/email';
import { getMessages } from "../lib/validation";
import { afterSignupAuth, isAdmin } from '../middlewares/signupAuth';
import multer from 'multer'
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
import { findMany, getCount } from '../lib/orm';



export async function find(req: Request, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.key) {
      let key = req.query.key.toString().trim()
      cond.OR = [
        {word: { contains: key, mode: 'insensitive'}},
        {translation: { contains: key, mode: 'insensitive'}},
      ]
    }
    if (req.query.type) {
      cond.type = req.query.type
    }
    let actors = await findMany(req, 'library', cond, {limit: 50})
    let count = await getCount('library', cond)
    
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


export async function getActors(req: Request, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.key) {
      let key = req.query.key.toString().trim()
      cond.name = { contains: key, mode: 'insensitive',}
    }
    let actors = await findMany(req, 'person', cond, {limit: 50})
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

export async function getMovies(req: Request, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.key) {
      let key = req.query.key.toString().trim()
      cond.OR = [
        {title: { contains: key, mode: 'insensitive'}},
        {origin: { contains: key, mode: 'insensitive'}},
      ]
    }
    let options = {limit: 50}
    let movies = await findMany(req, 'movie', cond, options)
    let count = await getCount('movie', cond)
    
    return res.json({
      success: true,
      data: movies,
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
    let options: any = {include: {IntuitionPackContent: true}}
    
    if (res.locals.auth.userRole == 'USER') {
      options.include.IntuitionResult = {
        where: {
          user_id: res.locals.auth.id
        }
      }
      cond.enable = true
    }
    let data = await findMany(req, 'intuitionPack', cond, options)
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

export async function getPacksCast(req: any, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.id) {
      cond.id = parseInt(req.query.id)
    }
    let options: any = {include: {CastPackContent: { include: {movie: true}} }}
    
    if (res.locals.auth.userRole == 'USER') {
      options.include.CastResult = {
        where: {
          user_id: res.locals.auth.id
        }
      }
      cond.enable = true
    }
    let data = await findMany(req, 'castPack', cond, options)
    let count = await getCount('castPack', cond)
    
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

export async function getPacksQuiz(req: any, res: Response, _next: NextFunction) {
  try {
    let cond: any = {}
    if (req.query.id) {
      cond.id = parseInt(req.query.id)
    }
    let options: any = {include: {QuizPackRound: { include: {answer: true}} }}
    
    if (res.locals.auth.userRole == 'USER') {
      options.include.QuizResult = {
        where: {
          user_id: res.locals.auth.id
        }
      }
      cond.enable = true
    }
    let data = await findMany(req, 'quizPack', cond, options)
    let count = await getCount('quizPack', cond)
    
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

export async function getRoom(req: any, res: Response, _next: NextFunction) {
  try {
    let room
    if (req.query.id) {
      room = await prisma.Room.findFirst({
        where: {
          token: req.query.id,
        },
        include: {RoomUser: true}
      })
    } 
    if (!room) {
      let type = req.query.type ? req.query.type : 'user' 
      room = await prisma.Room.findFirst({
        where: {
          entity_id: res.locals.auth.id,
          type: type
        },
        include: {pack: true}
      })
      if (!room) {
        room = await prisma.Room.create({
          data: {
            entity_id: res.locals.auth.id,
            type: type,
            token: req.query.id ? req.query.id : generateUniqueString(),
            info: JSON.stringify({user_id: res.locals.auth.id, username: res.locals.auth.username})
          }
        })
      }
    }
    
    return res.json({
      success: true,
      data: room
    });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}


export async function getRooms(req: any, res: Response, _next: NextFunction) {
  try {
    let cond: any = {type: 'user'}
    let roomsActive = []
    if (req.query.available) {
      cond.isActive = false
      let activeRoom = await prisma.RoomUsers.findMany({
        where: {user_id: res.locals.auth.id}
      })
      let ids = activeRoom.map((one: any) => one.room_id)
      if (ids.length) {
        roomsActive = await prisma.Room.findMany({
          where: {id: { in:ids }}, include: {pack: true, RoomUser: true}
        })
      }
    }
    let room = await prisma.Room.findMany({
      where: cond, include: {pack: true, RoomUser: true}
    })
    
    return res.json({
      success: true,
      data: room,
      roomsActive
    });
    
  } catch (err) {
    console.log('err',err)
    return errorHandler(createError.InternalServerError(), req, res)
  }
}

// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'get', path: '/actors', handler: [afterSignupAuth, getActors] },
    { method: 'get', path: '/movies', handler: [afterSignupAuth, getMovies] },
    { method: 'get', path: '/find', handler: [afterSignupAuth, find] },
    { method: 'get', path: '/packsIntuition', handler: [ afterSignupAuth, getPacksIntuition ] },
    { method: 'get', path: '/packsCast', handler: [ afterSignupAuth, getPacksCast ] },
    { method: 'get', path: '/packsQuiz', handler: [ afterSignupAuth, getPacksQuiz ] },


    { method: 'get', path: '/room', handler: [ afterSignupAuth, getRoom ] },
    { method: 'get', path: '/rooms', handler: [ afterSignupAuth, getRooms ] },


    
  ],
}

export default routes
