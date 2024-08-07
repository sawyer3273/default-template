const config = require('../config').load()
const Cookie = require('cookie')
const jwt = require('jsonwebtoken')


export const afterSignupAuth = async (req, res, next) => {
  var cookie = req.headers.cookie ? Cookie.parse(req.headers.cookie) : {}
  var parsed = cookie
  if (cookie.formData == undefined && cookie.user == undefined || req.headers.token) {
    let token = req.headers && req.headers.token ? req.headers && req.headers.token : ''
    console.log('req.originalUrl',req.originalUrl)
    console.log('req.headers',req.headers)
    console.log('req.body',req.body)
    console.log('req.query',req.query)
    if (token) {
      jwt.verify(token, config.jwtKey, async (err, decode) => {
        if (err) {
          console.log('invalid token 1')
          return res.status(401).json({
              success: false,
              c: 'invalid token 1'
          })
        } else {
          res.locals.auth = {
            id: decode.userId,
            createAuth: false
          }
          next()        
        }
      })
    } else {
      console.log('user data not found 1')
      return res.status(401).json({
        success: false,
        c: 'user data not found 1'
      })
    }
  } else {
    if (cookie.user != undefined) {
      let user = JSON.parse(parsed.user)
      
      jwt.verify(JSON.parse(parsed.user).token, config.jwtKey, (err, decode) => {
        if (err) {
          console.log('invalid token 3')
          return res.status(401).json({
              success: false,
              c: 'invalid token 3'
          })
        } else {
          res.locals.auth = {
            id: JSON.parse(parsed.user).id,
            createAuth: true
          }
          next()        
        }
      })
    } else {
      jwt.verify(JSON.parse(parsed.auth).accessToken, config.jwtKey, (err, decode) => {
        if (err) {
          console.log('invalid token 4')
          return res.status(401).json({
              success: false,
              c: 'invalid token 4'
          })
        } else {
          res.locals.auth = {
            id: decode.userId,
            createAuth: false
          }
          next()        
        }
      })
    }
  }
}