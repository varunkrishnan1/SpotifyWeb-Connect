# 🎵 Spotify Now Playing Widget - Setup Guide

## How the Login System Works

Your widget uses **OAuth 2.0 Implicit Grant Flow** - this means:

1. **User clicks "Login with Spotify"** → Redirects to Spotify's official login page
2. **User logs in with their Spotify credentials** → Spotify handles authentication securely  
3. **Spotify redirects back** → With an access token to fetch your data
4. **Widget fetches your music** → Using Spotify Web API in real-time

**✅ No passwords stored** - Everything is handled securely by Spotify!

## 🚀 Quick Setup (3 Steps)

### Step 1: Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Click **"Create an App"**
3. Fill in:
   - **App Name**: `My Now Playing Widget`  
   - **App Description**: `Personal music widget`
   - **Website**: `http://localhost:3000` (for local testing)
   - **Redirect URI**: `http://localhost:3000` ⚠️ **MUST MATCH YOUR CONFIG**

4. **Copy your Client ID** (you'll need this)

### Step 2: Configure the Widget

1. Open `config.js` in your project
2. Replace `"your_spotify_client_id_here"` with your actual Client ID:

```javascript
const CONFIG = {
  CLIENT_ID: "your_actual_client_id_here", // ← Put your Client ID here
  REDIRECT_URI: "http://localhost:3000",   // ← Must match Spotify app settings
  // ... other settings
};
```

### Step 3: Run the Widget

**Option A: Live Server (Recommended)**
```bash
# If you have Live Server VS Code extension
# Right-click index.html → "Open with Live Server"
```

**Option B: Python Server**
```bash
# In your project directory
python3 -m http.server 3000
# Then open: http://localhost:3000
```

**Option C: Node.js Server**
```bash
npx http-server -p 3000
# Then open: http://localhost:3000
```

## 🔧 For GitHub Pages Deployment

If you want to host this online:

1. **Update config.js**:
```javascript
const CONFIG = {
  CLIENT_ID: "your_client_id",
  REDIRECT_URI: "https://yourusername.github.io/your-repo-name/", // ← GitHub Pages URL
  // ...
};
```

2. **Update Spotify App Settings**:
   - Add your GitHub Pages URL to "Redirect URIs" in Spotify Developer Dashboard

## 🎯 How the API Works

Your widget uses these Spotify Web API endpoints:

### Authentication Flow:
```
1. User → Spotify Login Page
2. Spotify → Returns access token  
3. Widget → Stores token securely
```

### Data Fetching:
```
GET https://api.spotify.com/v1/me/player/currently-playing
Headers: Authorization: Bearer {access_token}

Response: {
  "item": {
    "name": "Song Title",
    "artists": [{"name": "Artist Name"}],
    "album": {
      "name": "Album Name",
      "images": [{"url": "cover_art_url"}]
    },
    "duration_ms": 240000
  },
  "progress_ms": 120000,
  "is_playing": true
}
```

## 🔒 Security Features

✅ **No Client Secret needed** - Implicit flow is designed for client-side apps  
✅ **Tokens expire automatically** - Usually after 1 hour  
✅ **No sensitive data stored** - Only temporary access tokens  
✅ **Local storage only** - Tokens stay in your browser  

## 🎵 Login Process Explained

When you open the widget:

1. **First Time**: Shows "Connect to Spotify" button
2. **Click Login**: Redirects to `accounts.spotify.com` (official Spotify login)
3. **Enter Credentials**: Your Spotify username/password (handled by Spotify)
4. **Grant Permissions**: Allow app to read your currently playing track
5. **Redirect Back**: Widget automatically starts showing your music!

## 🔄 How Real-time Updates Work

```javascript
// The widget polls Spotify every 1 second (configurable)
setInterval(() => {
  fetchCurrentlyPlaying(); // → Updates UI automatically
}, 1000);
```

**What updates automatically:**
- ✅ Song changes
- ✅ Play/pause status  
- ✅ Progress bar
- ✅ Album artwork
- ✅ Artist/song info

## 🚨 Troubleshooting

### "Configuration not loaded"
- Make sure `config.js` is in the same folder as `index.html`
- Check that your Client ID is set correctly

### "Not Playing" shown
- Open Spotify and play a song
- Make sure you're logged into the same Spotify account

### Login doesn't work
- Check that Redirect URI in `config.js` matches your Spotify app settings exactly
- Try using `http://127.0.0.1:3000` instead of `localhost` if issues persist

### CORS errors
- Don't open the HTML file directly (file://) - use a local server
- Make sure you're serving from `http://localhost:3000` or similar

## 📱 Device Compatibility

**Works with any device playing Spotify:**
- ✅ Spotify Desktop App
- ✅ Spotify Web Player  
- ✅ Spotify Mobile App
- ✅ Spotify Connect devices (smart speakers, etc.)

The widget shows whatever you're playing across **all your devices**!

## ⚡ Quick Test

1. Set up your Client ID in `config.js`
2. Run a local server on port 3000
3. Open `http://localhost:3000`
4. Click "Login with Spotify"
5. Play a song in Spotify
6. Watch the magic happen! 🎵

---

**Need help?** Check the browser console (F12) for detailed error messages and logs.
