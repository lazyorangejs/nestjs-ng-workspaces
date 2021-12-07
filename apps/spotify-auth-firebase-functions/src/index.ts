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

const { app: spotifyAuthServer } = createSpotifyAuthServer(
  'e774119d73c84bb998a08aea44089436',
  '5240a062e734429db66a6c790f3a1b17'
)

export const spotifyAuth = functions.https.onRequest(spotifyAuthServer)

process.on(
  'auth:spotify:finished',
  ({ accessToken, refreshToken, expiresIn, profile }) => {
    functions.logger.info('Successfully logged in!', { profile })
  }
)
