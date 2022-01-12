/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import 'dotenv/config'
import { createSpotifyAuthServer } from '@lazyorange/spotify-express-passport-auth'

const { SPOTIFY_CLIENT_ID: clientID, SPOTIFY_CLIENT_SECRET: clientSecret } =
  process.env

const { app, port } = createSpotifyAuthServer(clientID, clientSecret)

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`)
  console.log(
    `You can find info about account at http://localhost:${port}/account`
  )
  console.log(
    `Connect Spotify account at http://localhost:${port}/auth/spotify`
  )
})

server.on('error', console.error)
