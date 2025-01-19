// ライブラリの読み込み
import express from 'express'
import { onRequest } from 'firebase-functions/v2/https'

import {
  getPlaces,
} from './src/controllers/places.controller.js'

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

export const api = onRequest(
  {
    region: 'asia-northeast1',
    minInstances: 1,
  },
  app
)
