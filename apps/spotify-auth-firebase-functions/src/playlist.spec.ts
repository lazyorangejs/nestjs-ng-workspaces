jest.setTimeout(25_000)

import { editPlaylist, buildSpotifyClient } from './playlist'

describe('#editPlaylist', () => {
  // FIXME:
  // 1. Create a user in Spotify to be able to create testing playlist.
  // 2. Create an user in firebase auth emulator and attach spotify credentials to the user.
  // 3. Run e2e tests.
  it.skip('should work', async () => {
    const uid = 'spotify:31el5t5b5t2ro3il6wor3kh5f5ai'
    const client = await buildSpotifyClient(uid)

    const blocklistID = '0M4buVSktMgWQd34QH1dTG'
    const originalPlaylistID = '37i9dQZF1DX5ECfKO3L7Vd'
    const playlistID = '745cqKvEazGfIvamZcfRmC'

    await editPlaylist(client, playlistID, originalPlaylistID, blocklistID)
  })
})
