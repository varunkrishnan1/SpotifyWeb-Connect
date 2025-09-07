# 🎵 SpotifyWeb-Connect

A real-time Spotify "Now Playing" web application that displays your currently playing track with album artwork, progress bar, and track information.

![Spotify Web Connect](https://img.shields.io/badge/Spotify-Web%20Connect-1DB954?style=for-the-badge&logo=spotify&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## ✨ Features

- 🎧 **Real-time Now Playing**: Displays your currently playing Spotify track
- 🖼️ **Album Artwork**: Shows the album cover of the current track
- 📊 **Progress Bar**: Visual progress indicator with time elapsed/duration
- 🎵 **Track Information**: Song title and artist name
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Auto-refresh**: Updates every 2 seconds automatically
- 🎨 **Dark Theme**: Sleek dark interface matching Spotify's aesthetic

## 🚀 Live Demo

Visit the live application: [SpotifyWeb-Connect](https://github.com/varunkrishnan1/SpotifyWeb-Connect)

## 📸 Screenshot

The application displays a clean, card-based interface showing:
- Album artwork
- Song title
- Artist name(s)
- Progress bar
- Time elapsed / Total duration

## 🛠️ Setup Instructions

### Prerequisites
- A Spotify account (Free or Premium)
- A Spotify Developer Application

### 1. Spotify App Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Click "Create an App"
3. Fill in the details:
   - **App Name**: SpotifyWeb-Connect
   - **App Description**: Web application for displaying now playing
4. Note down your **Client ID**
5. Add redirect URI: `http://localhost:5500` (or your hosting URL)

### 2. Configuration
1. Clone this repository:
   ```bash
   git clone https://github.com/varunkrishnan1/SpotifyWeb-Connect.git
   cd SpotifyWeb-Connect
   ```

2. Open `script.js` and update the configuration:
   ```javascript
   const clientId = "YOUR_SPOTIFY_CLIENT_ID";
   const redirectUri = "http://localhost:5500"; // Update if hosting elsewhere
   ```

### 3. Running the Application

#### Option 1: Local Development
- Use Live Server extension in VS Code
- Or use any local server (like `python -m http.server`)
- Open `http://localhost:5500`

#### Option 2: Direct File Access
- Simply open `index.html` in your browser
- Update `redirectUri` in `script.js` to match your file path

## 🔧 Technical Details

### Built With
- **HTML5**: Structure and semantics
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Spotify API integration and DOM manipulation
- **Bootstrap 5**: CSS framework for responsive design
- **Spotify Web API**: Real-time music data

### API Endpoints Used
- `https://api.spotify.com/v1/me/player/currently-playing`

### Spotify Scopes Required
- `user-read-currently-playing`: Access to currently playing track
- `user-read-playback-state`: Access to playback state

## 🎯 How It Works

1. **Authentication**: Uses Spotify's OAuth 2.0 Implicit Grant Flow
2. **Authorization**: Redirects user to Spotify login
3. **Token Extraction**: Extracts access token from URL hash
4. **API Calls**: Makes requests to Spotify Web API every 2 seconds
5. **Display**: Updates the UI with current track information

## 📱 Responsive Design

The application is fully responsive and works on:
- 💻 Desktop computers
- 📱 Mobile phones
- 📟 Tablets

## 🔒 Security Notes

- This app uses the Implicit Grant Flow (client-side only)
- Access tokens are temporary and stored in browser memory
- No server-side storage of credentials
- Client ID is safely exposed (as intended by Spotify)

## 🚨 Troubleshooting

### Common Issues

1. **"Not Playing" displayed**
   - Make sure Spotify is actively playing music
   - Check that your Spotify app is open and playing

2. **Authentication fails**
   - Verify your Client ID in `script.js`
   - Ensure redirect URI matches in both code and Spotify app settings

3. **CORS errors**
   - Use a local server instead of opening HTML directly
   - Try Live Server extension in VS Code

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for providing the music data
- [Bootstrap](https://getbootstrap.com/) for the responsive CSS framework
- The Spotify team for their excellent developer documentation

## 📧 Contact

Varun Krishnan - krishnanvarun219@gmail.com

Project Link: [https://github.com/varunkrishnan1/SpotifyWeb-Connect](https://github.com/varunkrishnan1/SpotifyWeb-Connect)

---

⭐ If you found this project helpful, please give it a star!
