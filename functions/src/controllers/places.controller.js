import axios from 'axios'
import RemoteConfig from '../services/remoteConfig.service.js'

const GOOGLE_PLACES_API = 'https://places.googleapis.com/v1/places:searchText'


export const getPlaces = async (req, res) => {

  const rc = new RemoteConfig()
  await rc.init()

  const r = await axios.post(
    GOOGLE_PLACES_API,
    {
      textQuery: req.body.text,
      languageCode: 'ja',   // TODO: 多言語対応化
      locationBias: {
        circle: {
          center: {
            latitude: req.body.lat,
            longitude: req.body.lng,
          },
          radius: 500.0,
        }
      }
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': `${rc.getEnv('GOOGLE_API_KEY')}`,
        'X-Goog-FieldMask': '*',
      },
    },
  )

  console.log(r.data)

  res.send(r.data.places)
}