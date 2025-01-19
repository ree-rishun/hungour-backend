// ライブラリの読み込み
import express from 'express'
import { onRequest } from 'firebase-functions/v2/https'

import {
  getPlaces,
} from './src/controllers/places.controller.js'

const app = express()


app.get(
  '/api/places/',
  getPlaces)

export const api = onRequest(
  {
    region: 'asia-northeast1',
    minInstances: 1,
  },
  app
)
