import * as functions from 'firebase-functions'
import SpotifyWebApi from 'spotify-web-api-node'
import { tokenSetColl } from './global'

export const buildSpotifyClient = async (uid: string) => {
  const clientId = functions.config().spotify?.client_id
  const clientSecret = functions.config().spotify?.client_secret
  const redirectUri = functions.config().spotify?.redirect_uri

  const doc = await tokenSetColl.doc(uid).get()

  const client = new SpotifyWebApi({ clientId, clientSecret, redirectUri })

  if (doc.exists) {
    client.setAccessToken(doc.get('access_token'))
    client.setRefreshToken(doc.get('refresh_token'))

    const tokenSet = await client.refreshAccessToken()
    if (tokenSet.statusCode === 200 && tokenSet.body.access_token) {
      client.setAccessToken(doc.get('access_token'))
    }

    const expires_at = new Date(Date.now() + tokenSet.body.expires_in * 1000)
    functions.logger.info('updating tokenSet', { uid, expires_at })

    await doc.ref.set({ expires_at, ...tokenSet.body }, { merge: true })
  } else {
    functions.logger.info('tokenSet is not found', { uid })
  }

  return client
}
