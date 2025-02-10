import admin from 'firebase-admin'

export const createCustomToken = async (sub, name, picture) => {
  return await admin.auth().createCustomToken(sub, {
    name,
    picture
  })
}