// https://firebase.google.com/docs/emulator-suite/connect_rtdb
// process.env.FIREBASE_DATABASE_EMULATOR_HOST = 'localhost:9000'

// The Firebase Admin SDK to access Firebase Features from within Cloud Functions.
import * as admin from 'firebase-admin'

const app = admin.initializeApp()

// Set up extra settings. Since May 29, 2020, Firebase Firebase Added support for
// calling FirebaseFiresore.settings with { ignoreUndefinedProperties: true }.
// When this parameter is set, Cloud Firestore ignores undefined properties
// inside objects rather than rejecting the API call.
admin.firestore().settings({
  ignoreUndefinedProperties: true,
})

export const db = app.firestore()

export const tokenSetColl = db.collection('tokenSet')
