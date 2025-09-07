// Spotify API Configuration
// Replace these values with your own Spotify app credentials

const CONFIG = {
  // Your Spotify Client ID (get this from https://developer.spotify.com/dashboard/)
  CLIENT_ID: "your_spotify_client_id_here",
  
  // Redirect URI - must match exactly what's set in your Spotify app settings
  // For local development: "http://localhost:3000" or "http://127.0.0.1:5500"
  // For GitHub Pages: "https://yourusername.github.io/your-repo-name/"
  REDIRECT_URI: "http://localhost:3000",
  
  // Spotify API scopes needed for the application
  SCOPES: "user-read-currently-playing user-read-playback-state",
  
  // Update interval in milliseconds (how often to fetch new data)
  UPDATE_INTERVAL: 1000
};

// Export config for use in other files
window.SPOTIFY_CONFIG = CONFIG;
