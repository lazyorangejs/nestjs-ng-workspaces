// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
import * as admin from 'firebase-admin'
import SpotifyWebApi from 'spotify-web-api-node'
import { AuthorizationCode } from 'simple-oauth2'

const app = admin.initializeApp(undefined, 'spotify-auth')

// Set up extra settings. Since May 29, 2020, Firebase Firebase Added support for
// calling FirebaseFiresore.settings with { ignoreUndefinedProperties: true }.
// When this parameter is set, Cloud Firestore ignores undefined properties
// inside objects rather than rejecting the API call.
admin.firestore(app).settings({
  ignoreUndefinedProperties: true,
})

const db = app.firestore()
const authApp = app.auth()

const clientId: string = functions.config().spotify?.client_id
const clientSecret: string = functions.config().spotify?.client_secret
const redirectUri: string = functions.config().spotify?.redirect_uri

// https://developer.spotify.com/documentation/general/guides/scopes/
const scope = [
  'playlist-read-private',
  'user-read-email',
  'playlist-modify-private',
  'user-read-playback-state',
]

const client = new AuthorizationCode({
  client: { id: clientId, secret: clientSecret },
  auth: {
    tokenHost: 'https://accounts.spotify.com',
    authorizePath: '/oauth2/v2/auth',
    tokenPath: '/api/token',
  },
})

export const spotifyAuth = functions.https.onRequest(async (_, res) => {
  const authorizationUrl = client.authorizeURL({
    scope,
    redirect_uri: redirectUri,
  })

  functions.logger.info('Spotify Auth parameters', {
    scope,
    redirectUri,
    authorizationUrl,
  })

  res.redirect(authorizationUrl)
})

export const spotifyCallback = functions.https.onRequest(async (req, res) => {
  try {
    const accessToken = await client.getToken({
      code: req.query.code as string,
      redirect_uri: redirectUri,
      scope,
    })
    functions.logger.log('received and validated tokens', {
      accessToken,
      token: accessToken.token,
    })

    const spotifyApiClient = new SpotifyWebApi()
    spotifyApiClient.setAccessToken(accessToken.token.access_token)

    const { body: userinfo } = await spotifyApiClient.getMe()

    const token = await createFirebaseAccount(
      userinfo.id,
      userinfo.email,
      accessToken.token as TokenSet,
      userinfo.display_name,
      userinfo.images?.shift()?.url
    )

    res.json({ userinfo, token })
  } catch (error) {
    functions.logger.error(error)
    functions.logger.error('Access Token Error', { error })
    res.json('fail')
  }
})

type TokenSet = {
  access_token: string
  refresh_Token: string
  scope: string
  expires_in: number
  expires_at: string
}

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(
  spotifyID: string,
  email: string,
  tokenSet: TokenSet,
  displayName?: string,
  photoURL?: string
) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`

  const saveTokenSetTask = db.doc(`/tokenSet/${uid}`).set(tokenSet)

  // Create or update the user account.
  const userCreationTask = authApp
    .updateUser(uid, {
      displayName,
      photoURL,
      email,
      emailVerified: true,
    })
    .catch((error) => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return authApp.createUser({
          uid: uid,
          displayName: displayName,
          photoURL: photoURL,
          email: email,
          emailVerified: true,
        })
      }
      throw error
    })

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  await Promise.all([userCreationTask, saveTokenSetTask])
  // Create a Firebase custom auth token.
  const token = await authApp.createCustomToken(uid)

  functions.logger.log('Created Custom token for UID "', uid, '" Token:', token)
  return token
}
