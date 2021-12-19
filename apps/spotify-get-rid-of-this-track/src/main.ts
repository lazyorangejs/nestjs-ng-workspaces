import { getAuth, signInWithCustomToken } from 'firebase/auth'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: 'spotify-get-rid-of-shit',
  appId: '1:1006585639798:web:9bf90a89c1ea32fdb60057',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const token =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTYzOTkyMzg1MCwiZXhwIjoxNjM5OTI3NDUwLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1zaDZld0BzcG90aWZ5LWdldC1yaWQtb2Ytc2hpdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXNoNmV3QHNwb3RpZnktZ2V0LXJpZC1vZi1zaGl0LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoic3BvdGlmeTozMWVsNXQ1YjV0MnJvM2lsNndvcjNraDVmNWFpIn0.mT6pCO0W2-P4YkFdnEf7DtUqrIEn25tvYgOWvb7nhQG1pm0964_0VJAacG4oFSkJTPi6w0DvL7QfxpKA2FFVtVTwyZXIgjU5uMJGCNNX9U-k8mBdr2c0cC65Sd4pR_6CErP4EkRf_9E3KeZ_EKjNfPAU118TR7vYAeZ5scU0FSqFlgXZvGyzKBwnCFv0oGQMJLGHY7O5XTbA5bn3FylzOrP_YafTM-j6i0H5b5FTYN2WDshxNXI_877nxMt-g6Aq-vO0eNqp6sKvElsv7LL4W9qen0oIq2Ps8ph2wD3nm8NR3XOzx6IvwR4jSMXxCbyJOGw0pBGkaLuV6OA0G4xb3w'

signInWithCustomToken(auth, token)
  .then((data) => data.user.getIdToken())
  .then((token) => console.log('user token: ', token))
  .catch((err) => console.error(err))

// createUserWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code
//     const errorMessage = error.message
//     // ..
//   })
