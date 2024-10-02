import express from 'express'
import session from 'express-session'
import passport from 'passport'
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import bodyParser from 'body-parser'
import http from 'http';
import { Server } from "socket.io";
import { addToRoom, removeFromRoom } from './lib/socketFunctions'

import routes from './routes'
import i18next from 'i18next'
import Backend from 'i18next-node-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'
import Fingerprint from 'express-fingerprint'

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/../../locales/{{lng}}.json'
        },
        fallbackLng: 'ru',
        preload: ['ru']
    });

const DEFAULT_SECRET = 'secret'

function initializeApplication() {
  const app = express()

  const server = http.createServer(app);
  
  const io = new Server(server, {
    //@ts-ignore
    cors:true,
    connectionStateRecovery: {}
  });
  io.on('connection', async (socket) => {
    console.log('-------------------');
    console.log('a user connected', socket.id);
    socket.on('disconnect', async () => {
      console.log('user disconnected', socket.id);
      let result = await removeFromRoom({ socket_id: socket.id})
      console.log('delete',result)
      io.to(result.room).emit('roomChange', result.data);
    });


    socket.on('connectToRoom', async (room, userToken) => {
      socket.join(room);
      console.log('connectToRoom', room)
      var clients_in_the_room = Array.from(io.sockets.adapter.rooms.get(room));
      let result = await addToRoom({room_token: room, user_token: userToken, socket_id: socket.id, clients: clients_in_the_room})
      console.log('add',result)
      io.to(room).emit('roomChange', result.data);

    });

    socket.on('disconnectFromRoom', async (room, userToken) => {
      socket.leave(room);
      console.log('disconnectFromRoom', room)
      let result = await removeFromRoom({socket_id: socket.id})
      console.log('delete',result)
      io.to(room).emit('roomChange', result.data);
    });
    


  });
  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });


  app.disable('x-powered-by')
  app.use(i18nextMiddleware.handle(i18next));

  app.use(Fingerprint({
    parameters:[
      //@ts-ignore
      Fingerprint.useragent, Fingerprint.acceptHeaders, Fingerprint.geoip,
    ]
  }))
  /**
   * Set up middlewares.
   */
  app.use(express.json())
  app.use(bodyParser.json({limit: "50mb"}));
  app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
  app.use(
    session({
      name: 'app',
      secret: DEFAULT_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())

  /**
   * Set app routes.
   */

  // Mount path **must** be same as path of serverMiddleware
  // https://github.com/nuxt/framework/issues/4591
  routes(app)

  return app
}

const app = initializeApplication()
console.log('server setup')
// 3 arguments handler must be wrapped by fromNodeMiddleware to pass h3 handler
// See https://github.com/nuxt/framework/releases/tag/v3.0.0-rc.12
const nodeApp = fromNodeMiddleware(app)

export default nodeApp
