import axios from 'axios'
import {getEnv} from '../config/remoteConfig.config.js'

const GOOGLE_GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json'

export const getGeocode = async (req, res) => {


  const r = await axios.get(
    `${GOOGLE_GEOCODE_API}?latlng=${req.query.lat},${req.query.lng}&key=${await getEnv('GOOGLE_API_KEY')}&region=JP&language=ja`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )

  res.send(r.data)
}