// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from 'firebase-functions'
import SpotifyWebApi from 'spotify-web-api-node'
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

export const buildSpotifyClient = async (uid: string) => {
  const clientId = functions.config().spotify?.client_id
  const clientSecret = functions.config().spotify?.client_secret
  const redirectUri = functions.config().spotify?.redirect_uri

  const doc = await tokenSetColl.doc(uid).get()

  const client = new SpotifyWebApi({ clientId, clientSecret, redirectUri })

  if (doc.exists) {
    client.setAccessToken(doc.get('access_token'))
    client.setRefreshToken(doc.get('refresh_token'))

    const tokenSet = await client.refreshAccessToken()
    if (tokenSet.statusCode === 200 && tokenSet.body.access_token) {
      client.setAccessToken(doc.get('access_token'))
    }

    const expires_at = new Date(Date.now() + tokenSet.body.expires_in * 1000)
    functions.logger.info('updating tokenSet', { uid, expires_at })

    await doc.ref.set({ expires_at, ...tokenSet.body }, { merge: true })
  } else {
    functions.logger.info('tokenSet is not found', { uid })
  }

  return client
}

export const authenticateIdToken = async (
  req: functions.https.Request,
  res
) => {
  const token = req.get('Authorization')?.split(' ')?.pop()
  try {
    const decodedToken = await authApp.verifyIdToken(token, true)
    return decodedToken
  } catch (err) {
    return null
  }
}

/**
 * Clone an playlist by given playlist id or edit if user is beeing owner.
 * All tracks will be removed
 *
 * @param {string} userId An owner of Spotify account on behalf to edit playlist
 * @param {string} playlistID An ID of the playlist to edit if user is owner or clone the original playlist
 * @param {string} blocklistPlaylistID An ID of the blocklist playlist which contains all artist which must be blocked, their tracks will be removed from playlist.
 */
const cloneOrEditPlaylist = async (
  userId: string,
  playlistID: string,
  blocklistPlaylistID: string
) => {
  const client = await buildSpotifyClient(userId)

  const playlist = await upsertPlaylist(client, playlistID)
  await editPlaylist(client, playlist.id, playlistID, blocklistPlaylistID)

  return playlist
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
    functions.logger.debug('authInfo', authInfo)

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
