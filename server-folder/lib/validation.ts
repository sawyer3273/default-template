import type { Result } from "express-validator";

export const getMessages = async (validation: Result) => {
  let mess = ''
  if (!validation.isEmpty()) {
    validation.array().map(one => {
        console.log('erro', one)
        mess += `${one.path}: ${one.msg}. ` 
    })
  } 
  return mess
};