import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [{
        name: 'Welcome to Paradise',
        artist: 'Green Day',
        album: 'Kerplunk!',
        id: '1'
      }],
      playlistName: 'Playlist Name',
      playlistTracks: [{
        name: 'Drifting',
        artist: 'Andy McKee',
        album: 'Art of Motion',
        id: '2'
      }]
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      const newPlaylistTracks = this.state.playlistTracks;
      newPlaylistTracks.push(track);
      this.setState({
        playlistTracks: newPlaylistTracks
      });
    }
  }

  removeTrack(track) {
    let newPlaylistTracks = this.state.playlistTracks;
    let removedTrack = this.state.playlistTracks.indexOf(track);
    if (removedTrack > -1) {
      newPlaylistTracks.splice(removedTrack, 1);
    }
    this.setState({
      playlistTracks: newPlaylistTracks
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
