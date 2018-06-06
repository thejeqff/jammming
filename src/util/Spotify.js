let accessToken = '';
let expiresIn = '';
const urlStart = 'https://accounts.spotify.com/authorize'
const clientId = 'client_id=02829885ac4a43d687963cfc747cc72f';
const responseType = 'response_type=token';
const scope = 'scope=playlist-modify-public'
const redirectUri = 'redirect_uri=http://localhost:3000/';
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

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
}

export default Spotify;
