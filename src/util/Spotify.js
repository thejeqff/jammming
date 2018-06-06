let accessToken = '';
let expiresIn = '';
const urlStart = 'https://accounts.spotify.com/authorize'
const clientId = 'client_id=02829885ac4a43d687963cfc747cc72f';
const responseType = 'response_type=token';
const scope = 'scope=playlist-modify-public'
const redirectUri = 'redirect_uri=http://thejeqff.surge.sh';
const redirect = `${urlStart}?${clientId}&${responseType}&${scope}&${redirectUri}`;

const searchUrl = 'https://api.spotify.com/v1/search?type=track&q='

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) &&
  window.location.href.match(/expires_in=([^&]*)/)) {
      let preAccessToken = window.location.href.match(/access_token=([^&]*)/);
      accessToken = preAccessToken[1];
      let preExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      expiresIn = preExpiresIn[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = redirect;
    }
  },

  search(searchTerm) {
    Spotify.getAccessToken();
    return fetch(`${searchUrl}${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.tracks.items) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      } else {
        return [];
      }
    });
  },

  savePlaylist: async (playlistName, trackURIs) => {
    if (!playlistName || !trackURIs) {
      return;
    }
    const sendPlaylistName = JSON.stringify({'name': playlistName});
    const sendTracks = JSON.stringify({'uris': trackURIs});
    const currentAccessToken = Spotify.getAccessToken();
    let userId = '';
    let playlistID = '';

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${currentAccessToken}`
        }
      })
    if (response.ok) {
      const jsonResponse = await response.json();
      userId = jsonResponse.id;
    }
  } catch(error) {
    console.log(error)
  }

  console.log(userId);

  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-type': 'application/json'
      },
      body: sendPlaylistName,
      method: 'POST'
    })
    if (response.ok) {
      const jsonResponse = await response.json();
      playlistID = jsonResponse.id;
    }
  } catch(error) {
      console.log(error);
  }

  console.log(playlistID);

  try {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-type': 'application/json'
      },
      body: sendTracks
    })
    if (response.ok) {
      const jsonResponse = response.json();
      return jsonResponse;
      }
    } catch(error) {
      console.log(error)
    }
  }
}

export default Spotify;
