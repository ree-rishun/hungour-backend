import { initializeApp } from 'firebase/app'
import { getFirestore, addDoc } from 'firebase/firestore'
import {applicationDefault} from 'firebase-admin/app'

export let db = null

export const initFirestore = async () => {
  if (db === null) {
    await initializeApp({
      credential: applicationDefault(),
      projectId: 'hunger-gourmet',
      appCheck: {
        enforcement: true,
      },
    })
    db = await getFirestore()
  }
  return db
}