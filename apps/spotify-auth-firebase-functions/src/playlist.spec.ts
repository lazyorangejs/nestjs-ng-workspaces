// import SpotifyWebApi from 'spotify-web-api-node'
process.env.GOOGLE_APPLICATION_CREDENTIALS =
  '/workspace/ng-workspaces/apps/spotify-auth-firebase-functions/firebase-admin-key.json'
process.env.GCLOUD_PROJECT = 'spotify-get-rid-of-shit'

import test = require('firebase-functions-test')();
test.mockConfig({ })


jest.setTimeout(25_000)

import { editPlaylist, buildSpotifyClient } from './playlist'

// export const buildSpotifyClient = async (uid: string) => {
//   const client = new SpotifyWebApi({ clientId, clientSecret, redirectUri })
// }

describe('#editPlaylist', () => {
  it.skip('should work', async () => {
    const client = await buildSpotifyClient(
      'spotify:31el5t5b5t2ro3il6wor3kh5f5ai'
    )
    const blocklistID = '0M4buVSktMgWQd34QH1dTG'
    const originalPlaylistID = '37i9dQZF1DX5ECfKO3L7Vd'
    await editPlaylist(
      client,
      '745cqKvEazGfIvamZcfRmC',
      originalPlaylistID,
      blocklistID,
      'spotify:31el5t5b5t2ro3il6wor3kh5f5ai'
    )
  })
})
