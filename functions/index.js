// ライブラリの読み込み
import express from 'express'
import { onRequest } from 'firebase-functions/v2/https'
import { getEnv } from './src/config/remoteConfig.config.js'
import { initFirestore } from './src/config/firestore.config.js'

import {
  getPlaces,
  getPhoto,
} from './src/controllers/places.controller.js'
import {
  getGeocode,
} from './src/controllers/geocode.controller.js'
import {
  createReserve,
  startReserve,
  readReserve,
} from './src/controllers/reserves.controller.js'
import {
  signinUser,
  activateUser,
} from './src/controllers/users.controller.js'

const app = express()

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, access_token'
  )

  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.send(200)
  } else {
    next()
  }
}
app.use(allowCrossDomain)

app.get(
  '/',
  (req, res) => {
    res.send(
      'hello api',
    )
  })

app.post(
  '/places/',
  getPlaces)

app.get(
  '/geocode/',
  getGeocode,
)

app.get(
  '/places/photos/',
  getPhoto,
)

app.post(
  '/reserves/',
  createReserve,
)

app.get(
  '/reserves/:id/',
  readReserve,
)

app.post(
  '/reserves/:id/start/',
  startReserve,
)

app.post(
  '/users/signin/',
  signinUser,
)

app.post(
  '/users/activate/',
  activateUser,
)

const init = async(req, res, next) => {
  await getEnv()
  await initFirestore()
  app(req, res, next)
}

export const api = onRequest(
  {
    region: 'asia-northeast1',
    minInstances: 1,
  },
  init
)
