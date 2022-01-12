import * as functions from 'firebase-functions'
import { authApp } from './global'

export const authenticateIdToken = async (
  req: functions.https.Request,
  _res
) => {
  const token = req.get('Authorization')?.split(' ')?.pop()
  try {
    const decodedToken = await authApp.verifyIdToken(token, true)
    return decodedToken
  } catch (err) {
    return null
  }
}
