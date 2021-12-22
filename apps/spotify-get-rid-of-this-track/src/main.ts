import { getAuth, signInWithCustomToken } from 'firebase/auth'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.FIREBASE_API_KEY,
  projectId: 'spotify-get-rid-of-shit',
  // appId: '1:1006585639798:web:9bf90a89c1ea32fdb60057',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY0MDE5MzUzMiwiZXhwIjoxNjQwMTk3MTMyLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1zaDZld0BzcG90aWZ5LWdldC1yaWQtb2Ytc2hpdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXNoNmV3QHNwb3RpZnktZ2V0LXJpZC1vZi1zaGl0LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoic3BvdGlmeTozMWVsNXQ1YjV0MnJvM2lsNndvcjNraDVmNWFpIn0.Nn_9vDNAkR8qoTbHtDlb6ngZNA_PjPIPZVmMpOQSpXz5tDgWa-17Wr1um5h8dMM35y3KwICUQIxtCUCwWky8KZs30pDp0mFiTjk7HfZQP8uPUx10pnTRKqhs3G2YUb0lkivWll16a_z_AHFi1UWRHOezwCKV6Ut0PbC9-_QSkXTf6O-JA8PwfcQFWjwRaH_j_pWL5yURirjYxHEyklYd_4MKnjrrSc3ikQyvOccGfkeiHOzK60oAVEEfF10IlspbSPKBvJ2Vpx4gEQ_yFI05NFwNx7JaAFGA8EyQ0cZbm9mZJbBusA6zJR6iRRyaZb_QvivoYvumw9J4VUpvVo8YsQ'

signInWithCustomToken(auth, token)
  .then((data) => data.user.getIdToken())
  .then((token) => console.log('user token: ', token))
  .catch((err) => console.error(err))
