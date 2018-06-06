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
      accessToken = window.location.href.match(/access_token=([^&]*)/).join('').substring(13,-1);
      expiresIn = window.location.href.match(/expires_in=([^&]*)/).join('').substring(11,-1);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = redirect;
    }
  }

  search(searchTerm) {
    return fetch(`${searchUrl}${searchTerm}`, {
      Authorization: `Bearer ${accessToken}`
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (jsonResponse.track)
    })
  }
}
