// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
import SpotifyWebApi from 'spotify-web-api-node'
import { db, tokenSetColl } from './global'

type PlaylistID = string

// https://open.spotify.com/playlist/1VW7yUMUFsH4jwUcAmU8Rq?si=7e723a8f9f094e22
export const upsertPlaylist = async (
  client: SpotifyWebApi,
  playlistId: PlaylistID
) => {
  const [{ body: me }, { body: originalPlaylist }] = await Promise.all([
    client.getMe(),
    client.getPlaylist(playlistId),
  ])

  if (originalPlaylist.owner.id === me.id) {
    return originalPlaylist
  }

  const playlist = await client.createPlaylist(originalPlaylist.name, {
    description: originalPlaylist.description,
    public: false,
  })

  const tracks = await client.getPlaylistTracks(playlistId, {
    fields: 'items',
  })

  await client.addTracksToPlaylist(
    playlist.body.id,
    tracks.body.items.map((t) => t.track.uri)
  )

  return playlist.body
}

const buildSpotifyClient = async (uid: string) => {
  const clientId = functions.config().spotify?.client_id
  const clientSecret = functions.config().spotify?.client_secret
  const redirectUri = functions.config().spotify?.redirect_uri

  const client = new SpotifyWebApi({ clientId, clientSecret, redirectUri })

  const doc = await tokenSetColl.doc(uid).get()
  if (doc.exists) {
    client.setAccessToken(doc.get('access_token'))
    client.setRefreshToken(doc.get('refresh_token'))

    const tokenSet = await client.refreshAccessToken()
    if (tokenSet.statusCode === 200 && tokenSet.body.access_token) {
      client.setAccessToken(doc.get('access_token'))
    }

    await doc.ref.set({ ...tokenSet.body }, { merge: true })
  }
  return client
}

export const clonePlaylist = functions.https.onRequest(async (req, res) => {
  const userId: string = req.query.user_id as string
  const playlistID: string = req.query.playlist_id as string

  // https://open.spotify.com/playlist/0M4buVSktMgWQd34QH1dTG
  const blocklistPlaylistID = '0M4buVSktMgWQd34QH1dTG'

  const doc = await db.collection('tokenSet').doc(userId).get()
  if (doc.exists) {
    const client = await buildSpotifyClient(userId)
    const [{ body: blockplaylistTracks }, playlist] = await Promise.all([
      client.getPlaylistTracks(blocklistPlaylistID, {
        fields: 'items',
      }),
      upsertPlaylist(client, playlistID),
    ])

    const tracksToRemove = blockplaylistTracks.items.map((itm) => itm.track)
    await client.removeTracksFromPlaylist(playlist.id, tracksToRemove)

    res.json({ playlistID: playlist.id })
  } else {
    res.send('Hello from Firebase!')
  }
})
