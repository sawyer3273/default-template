import path from 'path'
import express from "express";
import bodyParser from 'body-parser'
import cors from 'cors'
import { connectAllDatabase } from './models/mongodb'

require('dotenv').config()
let config = {}
config.host = process.env.HOST || '127.0.0.1'
if (!config.port) {
  config.port = process.env.PORT || 8000
}
const app = global.app = express()
app.set('port', config.port)
app.set('trust proxy', true);
// Import API Routes
if (process.env.databaseConnectOnInit) {
  connectAllDatabase()
}
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
app.use(bodyParser.json({limit: '50mb'})) // support json encoded bodies
app.use('/api', require('./routes')) // routes
/*
// Enable CORS
if (!nuxtConfig.dev) {
    app.use(cors())
}

// Import and Set Nuxt.js options
let nuxtConfig = require('../nuxt.config')
nuxtConfig.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(nuxtConfig)

// Build only in dev mode
if (nuxtConfig.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)
*/
// Listen the server

var server = app.listen(config.port, config.host);
server.timeout = 600 * 1000;
//server.setTimeout(500000);
console.log('Server listening on ' + config.host + ':' + config.port) // eslint-disable-line no-console

const h3handler = fromNodeMiddleware(app);
export default h3handler;