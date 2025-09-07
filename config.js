// Spotify API Configuration
// Replace these values with your own Spotify app credentials

const CONFIG = {
  // Your Spotify Client ID (get this from https://developer.spotify.com/dashboard/)
  CLIENT_ID: "ecfa8a73e39141f38cd496165e63b5b7",
  
  // Redirect URI - must match exactly what's set in your Spotify app settings
  // For local development: "http://localhost:3000" or "http://127.0.0.1:5500"
  // For GitHub Pages: "https://yourusername.github.io/your-repo-name/"
  REDIRECT_URI: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? `${window.location.protocol}//${window.location.host}` 
    : "https://varunkrishnan1.github.io/SpotifyWeb-Connect/",
  
  // Spotify API scopes needed for the application
  SCOPES: "user-read-currently-playing user-read-playback-state user-read-recently-played",
  
  // Update interval in milliseconds (how often to fetch new data)
  UPDATE_INTERVAL: 1000
};

// Export config for use in other files
window.SPOTIFY_CONFIG = CONFIG;
