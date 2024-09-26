import express from 'express'

import userRoutes from '../controllers/user'
import scrapperRoutes from '../controllers/scrapper'
import adminRoutes from '../controllers/admin'
import dataRoutes from '../controllers/data'
import statsRoutes from '../controllers/stats'
import { errorHandler as defaultErrorHandler, PageNotFoundHandler } from '../middlewares/errorHandler'
import { createResource } from '../routes/resourceHelper'

export default (app: express.Application) => {
  const router = express.Router({ caseSensitive: true, mergeParams: true })
  router.use('/user', createResource(userRoutes))
  router.use('/scrapper', createResource(scrapperRoutes))
  router.use('/admin', createResource(adminRoutes))
  router.use('/data', createResource(dataRoutes))
  router.use('/stats', createResource(statsRoutes))

  // Mount with version
  router.use(PageNotFoundHandler)
  router.use(defaultErrorHandler)

  app.use('/api', router)
}
