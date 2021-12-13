import { Issuer, generators } from 'openid-client'
import * as SpotifyWebApi from 'spotify-web-api-node'

import { AuthorizationCode } from 'simple-oauth2'

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'

// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
import * as admin from 'firebase-admin'
const app = admin.initializeApp()
const db = app.database()

// Set up extra settings. Since May 29, 2020, Firebase Firebase Added support for
// calling FirebaseFiresore.settings with { ignoreUndefinedProperties: true }.
// When this parameter is set, Cloud Firestore ignores undefined properties
// inside objects rather than rejecting the API call.
admin.firestore().settings({
  ignoreUndefinedProperties: true,
})

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})

const clientId = functions.config().spotify?.client_id
const clientSecret = functions.config().spotify?.client_secret
const redirectUri = functions.config().spotify?.redirect_uri

// https://developer.spotify.com/documentation/general/guides/scopes/
const scope = [
  'playlist-read-private',
  'user-read-email',
  'playlist-modify-private',
  'user-read-playback-state',
].join(' ')

const nonce = generators.nonce()

// https://5001-red-cardinal-iu4p8lek.ws-eu23.gitpod.io/spotify-get-rid-of-shit/us-central1/spotifyAuth
export const spotifyAuth = functions.https.onRequest(async (_, res) => {
  functions.logger.info('Spotify Auth parameters', { scope, redirectUri })

  const spotifyIssuer = await Issuer.discover('https://accounts.spotify.com')
  const client = new spotifyIssuer.Client({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri],
    response_types: ['code'],
  })

  const authorizationUrl = new URL(
    client.authorizationUrl({
      scope,
      nonce,
    })
  )
  authorizationUrl.searchParams.set('scope', scope)

  functions.logger.info({ authorizationUrl: authorizationUrl.toString() })

  res.redirect(authorizationUrl.toString())
})

export const spotifyCallback = functions.https.onRequest(async (req, res) => {
  const client = new AuthorizationCode({
    client: { id: clientId, secret: clientSecret },
    auth: {
      tokenHost: 'https://accounts.spotify.com',
      tokenPath: '/api/token',
    },
  })

  try {
    const accessToken = await client.getToken({
      code: req.query.code,
      redirect_uri: redirectUri,
      scope,
    })
    functions.logger.log('received and validated tokens', {
      accessToken,
      token: accessToken.token,
    })

    const spotifyApiClient = new SpotifyWebApi()
    spotifyApiClient.setAccessToken(accessToken.token.access_token)

    type SpotifyProfile = {
      display_name: string
      email: string
      id: string
      images: { url: string }[]
    }
    const { body: userinfo }: { body: SpotifyProfile } =
      await spotifyApiClient.getMe()

    await createFirebaseAccount(
      userinfo.id,
      userinfo.display_name,
      userinfo.images[0]?.url,
      userinfo.email,
      accessToken.token.access_token
    )

    res.json(userinfo)
  } catch (error) {
    functions.logger.error(error)
    functions.logger.error('Access Token Error', { error })
    res.json('fail')
  }
})

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /spotifyAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
async function createFirebaseAccount(
  spotifyID: string,
  displayName: string,
  photoURL: string,
  email: string,
  accessToken: string
) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`

  const saveAccessTokenTask = db
    .ref(`/accessTokens/${uid}`)
    .set({ accessToken })

  // await saveAccessTokenTask

  // Create or update the user account.
  const userCreationTask = admin
    .auth()
    .updateUser(uid, {
      displayName: displayName,
      photoURL: photoURL,
      email: email,
      emailVerified: true,
    })
    .catch((error) => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
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
  await Promise.all([userCreationTask, saveAccessTokenTask])
  // Create a Firebase custom auth token.
  const token = await admin
    .auth()
    .createCustomToken(uid, { accessToken, scope })

  functions.logger.log('Created Custom token for UID "', uid, '" Token:', token)
  return token
}
