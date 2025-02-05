import { doc, getDoc, setDoc, serverTimestamp, } from 'firebase/firestore'
import { initFirestore } from '../config/firestore.config.js'

const COLLECTION_NAME = 'users'

export const signinUser = async (req, res) => {
  const db = await initFirestore()

  const userId = req.body.user_id
  const docRef = doc(db, COLLECTION_NAME, userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    // TODO: ログイン履歴の更新
    console.log('hello')
  } else {
    const iconUrl = req.body.icon_url
    const displayName = req.body.display_name
    await setDoc(docRef, {
      line_id: userId,
      icon_url: iconUrl,
      display_name: displayName,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    })
  }

  res.send({
  })
}