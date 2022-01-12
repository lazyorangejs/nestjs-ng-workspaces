jest.setTimeout(25_000)

import {
  savePlaylistContext,
  editPlaylist,
  buildSpotifyClient,
} from './playlist'

import { tokenSetColl } from './global'

const uid = 'spotify:31el5t5b5t2ro3il6wor3kh5f5ai'

const {
  SPOTIFY_ACCESS_TOKEN: access_token,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env

// tests work with a real firebase project
describe('Playlist API', () => {
  beforeAll(async () => {
    await tokenSetColl
      .doc(uid)
      .set({ access_token, refresh_token }, { merge: true })
  })

  describe('#editPlaylist', () => {
    // FIXME:
    // 1. Create a user in Spotify to be able to create testing playlist.
    // 2. Create an user in firebase auth emulator and attach spotify credentials to the user.
    // 3. Run e2e tests.
    it('should work', async () => {
      const client = await buildSpotifyClient(uid)

      const blocklistID = '0M4buVSktMgWQd34QH1dTG'
      const originalPlaylistID = '37i9dQZF1DX5ECfKO3L7Vd'
      const playlistID = '745cqKvEazGfIvamZcfRmC'

      await editPlaylist(client, playlistID, originalPlaylistID, blocklistID)
    })
  })

  describe('#savePlaylistContext', () => {
    it('should work', async () => {
      const blocklistID = '0M4buVSktMgWQd34QH1dTG'
      const originalPlaylistID = '37i9dQZF1DX5ECfKO3L7Vd'
      const playlistID = '745cqKvEazGfIvamZcfRmC'
      const ownerID = 'spotify:31el5t5b5t2ro3il6wor3kh5f5ai'

      await savePlaylistContext({
        playlistID,
        originalPlaylistID,
        blocklistID,
        ownerID,
      })
    })
  })
})
