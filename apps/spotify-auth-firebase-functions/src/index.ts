// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'

// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
import * as admin from 'firebase-admin'
admin.initializeApp()

import { createSpotifyAuthServer } from '@lazyorange/spotify-express-passport-auth'

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
const origin =
  functions.config().spotify?.origin ||
  'https://5001-maroon-koala-nson26t9.ws-eu21.gitpod.io'

const baseUrl =
  functions.config().spotify?.base_url ||
  '/spotify-get-rid-of-shit/us-central1/spotifyAuth'

const scope = (process.env.SPOTIFY_EXPRESS_SCOPES ?? '').split(',')

const { app: spotifyAuthServer } = createSpotifyAuthServer(
  clientId,
  clientSecret,
  scope,
  origin,
  baseUrl
)

export const spotifyAuth = functions.https.onRequest(spotifyAuthServer)

// https://5001-maroon-koala-nson26t9.ws-eu21.gitpod.io/spotify-get-rid-of-shit/us-central1/spotifyAuth/auth/spotify

process.on('auth:spotify:finished', async ({ accessToken, profile }) => {
  const profilePic = profile?.user?.photos[0]?.value
  const spotifyUserID = profile.user?.id
  const userName = profile.user?.username
  const email = profile.user?.email

  const token = await createFirebaseAccount(
    spotifyUserID,
    userName,
    profilePic,
    email,
    accessToken
  )

  functions.logger.info('Successfully logged in!', { profile, token })
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

  // Save the access token to the Firebase Realtime Database.
  const databaseTask = admin
    .database()
    .ref(`/spotifyAccessToken/${uid}`)
    .set(accessToken)

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
  await Promise.all([userCreationTask, databaseTask])
  // Create a Firebase custom auth token.
  const token = await admin.auth().createCustomToken(uid)
  functions.logger.log('Created Custom token for UID "', uid, '" Token:', token)
  return token
}
