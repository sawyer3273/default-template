import type { RouteConfig } from '../routes/resourceHelper'
import type { Request, Response, NextFunction } from 'express'
import prisma from "../../tools/prisma";
import { encryptPassword, isPasswordMatch } from "../../utils/encryption";

export async function register(req: Request, res: Response, _next: NextFunction) {
  try {
    const { email, username, password } = req.body;
    let result = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: await encryptPassword(password),
      },
    });
    console.log('result',result)
    res.json({
      success: true,
      message: 'User Created'
    });
  } catch (err) {
    console.log('err',err)
    res.status(400).json({
      success: false,
      message: 'something wrong'
    })
  }
}

export const login = async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body;
console.log('req.body',req.body)
    let user;
    if (email) {
      user = await prisma.user.findFirst({
        where: {
          email: email
        },
      });
    } 
    console.log('user,',user)
    console.log('email',email)
    res.json({
      success: true,
      message: user
    })
  } catch (error) {
    console.log('error',error)
    res.status(400).json({
      success: false,
      message: 'something wrong'
    })
  }
};











// Mounted in routes.ts
export const routes: RouteConfig = {
  routes: [
    { method: 'post', path: '/register', handler: register },
    { method: 'post', path: '/login', handler: login },


  ],
}

export default routes
