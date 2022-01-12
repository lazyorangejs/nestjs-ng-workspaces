import { buildSpotifyClient } from './buildSpotifyClient'
import { upsertPlaylist, editPlaylist } from './playlist'

/**
 * Clone an playlist by given playlist id or edit if user is beeing owner.
 * All tracks will be removed
 *
 * @param {string} userId An owner of Spotify account on behalf to edit playlist
 * @param {string} playlistID An ID of the playlist to edit if user is owner or clone the original playlist
 * @param {string} blocklistPlaylistID An ID of the blocklist playlist which contains all artist which must be blocked, their tracks will be removed from playlist.
 */
export const cloneOrEditPlaylist = async (
  userId: string,
  playlistID: string,
  blocklistPlaylistID: string
) => {
  const client = await buildSpotifyClient(userId)

  const playlist = await upsertPlaylist(client, playlistID)
  await editPlaylist(client, playlist.id, playlistID, blocklistPlaylistID)

  return playlist
}
