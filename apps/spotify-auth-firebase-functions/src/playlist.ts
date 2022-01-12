// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
import SpotifyWebApi from 'spotify-web-api-node'
import { authenticateIdToken } from './authenticateIdToken'
import { buildSpotifyClient } from './buildSpotifyClient'
import { cloneOrEditPlaylist } from './cloneOrEditPlaylist'
import { authApp, tokenSetColl, playlistColl } from './global'

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

export const editPlaylist = async (
  client: SpotifyWebApi,
  playlistID: string,
  originalPlaylistID: string,
  blocklistPlaylistID: string
) => {
  const [
    { body: blockplaylistTracks },
    { body: originalPlaylistTracks },
    { body: playlistToEditTracks },
  ] = await Promise.all([
    client.getPlaylistTracks(blocklistPlaylistID, {
      fields: 'items',
    }),
    client.getPlaylistTracks(originalPlaylistID, {
      fields: 'items',
    }),
    client.getPlaylistTracks(playlistID, {
      fields: 'items',
    }),
    ,
  ])

  const tracksToRemove = blockplaylistTracks.items.map((itm) => itm.track)
  await client.removeTracksFromPlaylist(playlistID, tracksToRemove)

  const originalPlaylistTracksIDs: string[] = originalPlaylistTracks.items.map(
    (itm) => itm.track.uri
  )
  // add new tracks at the start of the playlist
  {
    tracksToRemove.forEach((track) => {
      const idx = playlistToEditTracks.items.findIndex(
        (t) => t.track.id === track.id
      )
      if (idx !== -1) {
        playlistToEditTracks.items.splice(idx, 1)
      }
      //
      const idx2 = originalPlaylistTracksIDs.findIndex(
        (itm) => itm === track.uri
      )
      if (idx2 !== -1) {
        originalPlaylistTracksIDs.splice(idx2, 1)
      }
    })

    const tracksToAdd = originalPlaylistTracksIDs.filter(
      (uri) => !playlistToEditTracks.items.find((itm) => itm.track.uri === uri)
    )

    if (tracksToAdd.length) {
      await client.addTracksToPlaylist(playlistID, tracksToAdd, { position: 0 })
    }
  }
}

type PlaylistContext = {
  playlistID: string
  originalPlaylistID: string
  ownerID: string
  blocklistID: string
}

export const savePlaylistContext = async ({
  playlistID,
  originalPlaylistID,
  ownerID,
  blocklistID,
}: PlaylistContext) => {
  await playlistColl
    .doc(playlistID)
    .set(
      { ownerID, playlistID, originalPlaylistID, blocklistID },
      { merge: true }
    )
}

const listPlaylistContext = async (ownerID: string) => {
  const resp = await playlistColl
    .where('ownerID', '==', ownerID)
    .limit(100)
    .get()

  const client = await buildSpotifyClient(ownerID)
  if (resp.docs) {
    await Promise.all(
      resp.docs
        .filter((doc) => doc.exists)
        .map((doc) => doc.data() as PlaylistContext)
        .map((doc) =>
          editPlaylist(
            client,
            doc.playlistID,
            doc.originalPlaylistID,
            doc.blocklistID
          )
        )
    )
  }
}

export const editPlaylistsByCron = functions.pubsub
  .schedule('5 * * * *')
  .onRun(async () => {
    let resp = await authApp.listUsers(100)
    const butchSize = 10
    while (resp.users.length) {
      await Promise.allSettled(
        resp.users
          .splice(0, butchSize)
          .filter((user) => !user.disabled)
          .map((user) => listPlaylistContext(user.uid))
      )
    }
    if (resp.pageToken) {
      resp = await authApp.listUsers(100, resp.pageToken)
    }
  })

export const cloneOrEditPlaylistHttp = functions.https.onRequest(
  async (req, res) => {
    const authInfo = await authenticateIdToken(req, res)

    // https://open.spotify.com/playlist/0M4buVSktMgWQd34QH1dTG
    const blocklistPlaylistID = '0M4buVSktMgWQd34QH1dTG'

    if (!authInfo) {
      res.status(401).json({
        status: 'not_authenticated',
        msg: 'Please connect your Spotify account',
      })
    } else {
      const doc = await tokenSetColl.doc(authInfo.uid).get()
      if (!doc.exists) {
        res.status(401).json({
          status: 'not_authenticated',
          msg: 'Please connect your Spotify account',
        })
      } else {
        const originalPlaylistID: string = req.query.playlist_id as string
        const playlist = await cloneOrEditPlaylist(
          authInfo.uid,
          originalPlaylistID,
          blocklistPlaylistID
        )

        await savePlaylistContext({
          originalPlaylistID,
          playlistID: playlist.id,
          ownerID: authInfo.uid,
          blocklistID: blocklistPlaylistID,
        })
        res.json({ status: 'ok', playlist })
      }
    }
  }
)
