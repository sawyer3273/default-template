import prisma from "~/tools/prisma";
import type { DataModels } from "~/types/indexType";

export const where = (cond: Object) => {
    let result = {}
/*
    Object.keys(cond).map((key) => {
        let one = cond[key]
        if ()
        result[key] = 
    }) 
    email: {
        contains: 'prisma.io',
      },
      */
}

export const findMany = (req: any, model: DataModels, where: any = {}, include: any = null) => {
    const size: string | null = <string>req.query.size || req.body.size || null
    const page: string | null = <string>req.query.page || req.body.page || null
    let sizeInt = parseInt(size ? size : '50')
    let pageInt = parseInt(page ? page : '1')
    let params: any = {
        take: sizeInt,
        skip: (pageInt - 1) * sizeInt, 
        where: where,
    }
    if (include) {
        params.include = include
    }
    return new Promise((resolve, reject) => {
        //@ts-ignore
        prisma[model].findMany(params).then((data: any, err: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }) 
    })
};

export const getCount = (model: DataModels, where: any = {}) => {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        prisma[model].count({
            where: where,
        }).then((data: any, err: any) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        }) 
    })
};