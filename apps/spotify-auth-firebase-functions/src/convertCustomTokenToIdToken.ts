import * as functions from 'firebase-functions'
import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyB-FTzAFr1pWCdQ2DJP5YN6_B7JYQ-qA5M',
  projectId: 'spotify-get-rid-of-shit',
  appId: '1:1006585639798:web:9bf90a89c1ea32fdb60057',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const convertCustomTokenToIdToken = async (token: string) => {
  return signInWithCustomToken(auth, token)
}

export const convertCustomTokenToIdTokenHttp = functions.https.onRequest(
  async (req, res) => {
    const token = req.get('Authorization')?.split(' ')?.pop()
    if (token) {
      const idToken = await convertCustomTokenToIdToken(token)
      res.json({ idToken })
    } else {
      res.status(400).json({ msg: 'token not valid' })
    }
  }
)
