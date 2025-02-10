import { doc, getDoc, setDoc, serverTimestamp, updateDoc, } from 'firebase/firestore'
import { initFirestore } from '../config/firestore.config.js'
import { getUserInfo } from '../services/line.service.js'
import { createCustomToken } from '../services/authentication.service.js'

const COLLECTION_NAME = 'users'

export const signinUser = async (req, res) => {
  const db = await initFirestore()

  const userId = req.body.user_id
  const docRef = doc(db, COLLECTION_NAME, userId)
  const docSnap = await getDoc(docRef)
  const lineToken = req.body.line_token

  const lineUserInfo = await getUserInfo(lineToken)
  // const customToken = await createCustomToken(lineUserInfo)

  if (docSnap.exists()) {
    // TODO: ログイン履歴の更新
    const docData = docSnap.data()
    res.send({
      status: docData.status,
    })
  } else {
    const iconUrl = req.body.icon_url
    const displayName = req.body.display_name
    await setDoc(docRef, {
      line_id: userId,
      icon_url: iconUrl,
      display_name: displayName,
      status: 'unactivated',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
    res.send({
      status: 'unactivated',
      // token: customToken,
    })
  }
}

export const activateUser = async (req, res) => {
  const db = await initFirestore()

  const userId = req.body.user_id
  const docRef = doc(db, COLLECTION_NAME, userId)
  const docSnap = await getDoc(docRef)

  if (! docSnap.exists()) {
    // TODO: エラーハンドリング
    console.error(`${COLLECTION_NAME} doc not found`)
  }

// TODO: user_id照会

  await updateDoc(docRef, {
    reserve_name: req.body.reserve_name,
    tel: req.body.tel,
    status: 'activated',
  })

  res.send({
    status: 'activated',
  })
}
