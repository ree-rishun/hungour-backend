import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc, } from 'firebase/firestore'
import { initFirestore } from '../config/firestore.config.js'
import { sendMessage } from '../services/line.service.js'
import { deployPod } from '../services/gke.service.js'
import {getEnv} from '../config/remoteConfig.config.js'

const COLLECTION_NAME = 'concierges'

export const readReserve = async (req, res) => {
  const db = await initFirestore()
  const reserveId = req.params.id

  const reserveRef = doc(
    db,
    COLLECTION_NAME,
    reserveId
  )
  const docSnap = await getDoc(reserveRef)

  if (! docSnap.exists()) {
    // TODO: エラーハンドリング
    console.error(`${COLLECTION_NAME} doc not found`)
  }

  res.send(
    docSnap.data()
  )
}

export const createReserve = async (req, res) => {
  const db = await initFirestore()
  console.log(req.body.user_id)
  const docRef = await addDoc(
    collection(db, COLLECTION_NAME),
    {
      user_id: req.body.user_id,
      list: req.body.shops,
      departure_time: req.body.departure_time,
      party_size: req.body.party_size,
      seat_type: req.body.seat_type,
      reserved_time: null,
      cursor: 0,
      status: 'created',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })

  res.send({
    id: docRef.id
  })
}

export const startReserve = async (req, res) => {
  const db = await initFirestore()
  const reserveId = req.params.id

  const reserveRef = doc(
    db,
    COLLECTION_NAME,
    reserveId
  )
  const docSnap = await getDoc(reserveRef)

  if (! docSnap.exists()) {
    // TODO: エラーハンドリング
    console.error(`${COLLECTION_NAME} doc not found`)
  }

  // TODO: user_id照会
  const docData = docSnap.data()

  await updateDoc(reserveRef, {
    reserve_list: req.body.shops,
    status: 'reserving',
    updated_at: serverTimestamp(),
  })

  // 予約サーバへ予約開始フック
  deployPod(reserveId)

  //　LINEによる予約開始通知
  const clientUrl = await getEnv('CLIENT_BASE_URL')
  const message = {
    'type': 'template',
    'altText': '予約を開始しました',
    'template': {
      'type': 'buttons',
      'thumbnailImageUrl': null,
      'imageAspectRatio': 'rectangle',
      'imageSize': 'cover',
      'imageBackgroundColor': '#FFFFFF',
      'title': '予約開始',
      'text': 'AIが電話でお店を予約しています',
      'defaultAction': {
        type: 'uri',
        label: '予約状況を確認',
        uri: `${clientUrl}/reserves/${reserveId}/status`
      },
      'actions': [
        {
          type: 'uri',
          label: '予約状況を確認',
          uri: `${clientUrl}/reserves/${reserveId}/status`
        }
      ]
    }
  }
  await sendMessage(
    docData.user_id,
    message,
  )

  res.send({
    id: reserveId,
  })
}
