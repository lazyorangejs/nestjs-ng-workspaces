import * as functions from 'firebase-functions'
import { cloneOrEditPlaylist } from './cloneOrEditPlaylist'

export const cloneOrEditPlaylistHttpDebug = functions.https.onRequest(
  async (req, res) => {
    // https://open.spotify.com/playlist/0M4buVSktMgWQd34QH1dTG
    const blocklistPlaylistID = '0M4buVSktMgWQd34QH1dTG'
    const playlistID: string = req.query.playlist_id as string
    const userID: string = req.query.user_id as string

    const playlist = await cloneOrEditPlaylist(
      userID,
      playlistID,
      blocklistPlaylistID
    )
    res.json({ playlist })
  }
)
