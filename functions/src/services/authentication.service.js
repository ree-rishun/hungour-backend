import { getAuth } from 'firebase/auth'

export const createCustomToken = async (sub, name, picture) => {
  const auth = getAuth()
  return await auth.createCustomToken(sub, {
    name,
    picture
  })
}