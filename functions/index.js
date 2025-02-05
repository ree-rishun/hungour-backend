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
} from './src/controllers/users.controller.js'

const app = express()


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
