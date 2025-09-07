// Replace with your Spotify credentials
const clientId = "ecfa8a73e39141f38cd496165e63b5b7";
const redirectUri = "https://varunkrishnan1.github.io/SpotifyWeb-Connect/callback"; // GitHub Pages URL
const scopes = "user-read-currently-playing user-read-playback-state";

let accessToken = null;

// 1. Get token from URL hash (OAuth implicit flow)
function getTokenFromUrl() {
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      const parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
  window.location.hash = "";
  return hash.access_token;
}

// 2. Redirect to Spotify login
function login() {
  window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
}

// 3. Fetch currently playing track
async function getNowPlaying() {
  if (!accessToken) return;

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (response.status === 204 || response.status > 400) {
    document.getElementById("song-title").innerText = "Not Playing";
    document.getElementById("artist-name").innerText = "";
    document.getElementById("album-cover").src = "";
    return;
  }

  const data = await response.json();
  if (data && data.item) {
    const song = data.item;
    const progress = data.progress_ms;
    const duration = song.duration_ms;

    document.getElementById("album-cover").src = song.album.images[0].url;
    document.getElementById("song-title").innerText = song.name;
    document.getElementById("artist-name").innerText = song.artists.map(a => a.name).join(", ");

    // Progress bar
    const percent = (progress / duration) * 100;
    document.getElementById("progress-bar").style.width = percent + "%";

    // Time formatting
    document.getElementById("time-elapsed").innerText = msToTime(progress);
    document.getElementById("time-duration").innerText = msToTime(duration);
  }
}

// Convert ms -> mm:ss
function msToTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// On load
window.onload = () => {
  accessToken = getTokenFromUrl();
  if (!accessToken) {
    login();
  } else {
    setInterval(getNowPlaying, 2000); // update every 2s
  }
};
