// ライブラリの読み込み
import express from 'express'
import { onRequest } from 'firebase-functions/v2/https'

import {
  getPlaces,
  getPhoto,
} from './src/controllers/places.controller.js'
import {
  getGeocode,
} from './src/controllers/geocode.controller.js'

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

export const api = onRequest(
  {
    region: 'asia-northeast1',
    minInstances: 1,
  },
  app
)
