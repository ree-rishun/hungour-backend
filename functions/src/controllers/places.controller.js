import axios from 'axios'
import RemoteConfig from '../services/remoteConfig.service.js'
import { calculateDistance } from '../utils/haversine.util.js'

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
          radius: req.body.radius,
        },
      },
      minRating: req.body.min_rating,
      openNow: req.body.open_now,
      includePureServiceAreaBusinesses: req.body.include_pure_service_area_businesses,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': `${rc.getEnv('GOOGLE_API_KEY')}`,
        'X-Goog-FieldMask': '*',
      },
    },
  )

  console.log(`all : ${r.data?.places.length ?? 'failed'}`)

  const fltdPlaces = filterPlaces(
    r.data.places,
    req.body.departure_in_minutes,
    {
      latitude: req.body.lat,
      longitude: req.body.lng,
    },
  )

  console.log(`fltdPlaces : ${fltdPlaces.length}`)

  res.send(fltdPlaces)
}


const filterPlaces = (places, departureInMinutes, nowPosition) => {
  const res = []
  for (const place of places) {
    if (
      place.reservable  // 予約可能
      && place.internationalPhoneNumber // 電話番号の有無
    ) {
      const distance = calculateDistance(
        place.location,
        nowPosition,
      )
      const walkingSpeedKmH = 4.8
      const now = new Date()

      // 出発可能時刻 + 90分 + 徒歩時間を計算
      const visitEndTime = new Date(
        now.getTime()
        + (departureInMinutes + 90 + (60 * distance / walkingSpeedKmH)) * 60 * 1000)

      // regularOpeningHours.nextCloseTime + utcOffsetMinutes を計算
      const nextCloseTime = new Date(place.regularOpeningHours.nextCloseTime)
      const adjustedCloseTime = new Date(nextCloseTime.getTime() + place.utcOffsetMinutes * 60 * 1000)

      if (
        visitEndTime < adjustedCloseTime  // 営業終了90分前に到着できる
        || (place.regularOpeningHours && place.regularOpeningHours.nextCloseTime === undefined) // 24時間営業
      ) {
        place.extWalkTime = 60 * distance / walkingSpeedKmH
        res.push(place)
      } else {
        console.log(`place.regularOpeningHours.nextCloseTime : ${place.regularOpeningHours?.nextCloseTime ?? place.regularOpeningHours}`)
      }
    } else {
      console.log(
        place.reservable,
        place.internationalPhoneNumber,
      )
    }
  }

  return res
}

export const getPhoto = async (req, res) => {
  const rc = new RemoteConfig()
  await rc.init()
  const { name, maxWidth = 400 } = req.query

  if (!name) {
    return res.status(400).json({ error: 'photo_reference is required' })
  }

  try {
    const photoUrl = `https://places.googleapis.com/v1/${name}/media?key=${rc.getEnv('GOOGLE_API_KEY')}&maxWidthPx=${maxWidth}`
    const response = await axios.get(photoUrl, { responseType: 'arraybuffer' })

    console.log(response)
    res.set('Content-Type', response.headers['content-type'])
    res.send(response.data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch image' })
  }
}
