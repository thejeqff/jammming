let userToken = '';
const client_id = '02829885ac4a43d687963cfc747cc72f';
const response_type = 'token';
const redirect_uri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken(client_id, response_type, redirect_uri, state) {
    if (userToken) {
      return userToken;
    } else {
      return fetch('https://accounts.spotify.com/authorize')
    }
  };
}
