let accessToken = '';
let expiresIn = '';
const urlStart = 'https://accounts.spotify.com/authorize'
const clientId = 'client_id=02829885ac4a43d687963cfc747cc72f';
const responseType = 'response_type=token';
const scope = 'scope=playlist-modify-public'
const redirectUri = 'redirect_uri=http://localhost:3000/';
const redirect = `${urlStart}?${clientId}&${responseType}&${scope}&${redirectUri}`;

const searchUrl = 'https://api.spotify.com/v1/search?type=track&q=';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.match(/access_token=([^&]*)/) &&
  window.location.href.match(/expires_in=([^&]*)/)) {
      let accessPreToken = window.location.href.match(/access_token=([^&]*)/);
      accessToken = accessPreToken[1];
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

  savePlaylist(playlistName, trackURIs) {
    if (!playlistName || !trackURIs) {
      return;
    }
    let currentAccessToken = accessToken;
    let userId = '';
    let playlistID = '';

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse) {
        userId = jsonResponse.id;
        console.log(userId)
      }
    });

    console.log(userId);

    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-type': 'application/json'
      },
      body: {
        name: playlistName
      },
      method: 'POST'
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      playlistID = jsonResponse.id;
      console.log(playlistID);
    });

    console.log(playlistID);

    fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${currentAccessToken}`,
        'Content-type': 'application/json'
      },
      body: {
        uris: trackURIs
      }
    }).then(response => {
      return response.json()
    }).then(jsonResponse => {
      return jsonResponse;
    });
  }
};

export default Spotify;
