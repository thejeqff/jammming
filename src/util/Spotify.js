let userToken = '';
const urlStart = 'https://accounts.spotify.com/authorize?'
const clientId = 'client_id=02829885ac4a43d687963cfc747cc72f&';
const responseType = 'response_type=token&';
const redirectUri = 'redirect_uri=http://localhost:3000/';
const redirect = urlStart + clientId + responseType + redirectUri;

const Spotify = {
  getAccessToken() {
    if (userToken) {
      return userToken;
    } else {
      window.location = url;
      window.location.href.match()
    }
  };
}
