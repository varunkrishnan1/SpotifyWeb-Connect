/**
 * Spotify Now Playing Widget
 * A real-time display of currently playing Spotify tracks
 * Author: Your Name
 * Version: 2.0
 */

class SpotifyWidget {
  constructor() {
    // Check if config is loaded
    if (!window.SPOTIFY_CONFIG) {
      this.showError('Configuration not loaded. Please check config.js file.');
      return;
    }

    this.config = window.SPOTIFY_CONFIG;
    this.accessToken = null;
    this.refreshInterval = null;
    this.currentTrack = null;
    this.isPlaying = false;
    
    // UI Elements
    this.elements = {
      loadingScreen: document.getElementById('loading-screen'),
      loginScreen: document.getElementById('login-screen'),
      mainWidget: document.getElementById('main-widget'),
      errorScreen: document.getElementById('error-screen'),
      loginBtn: document.getElementById('login-btn'),
      refreshBtn: document.getElementById('refresh-btn'),
      retryBtn: document.getElementById('retry-btn'),
      albumCover: document.getElementById('album-cover'),
      songTitle: document.getElementById('song-title'),
      artistName: document.getElementById('artist-name'),
      albumName: document.getElementById('album-name'),
      progressBar: document.getElementById('progress-bar'),
      timeElapsed: document.getElementById('time-elapsed'),
      timeDuration: document.getElementById('time-duration'),
      playIcon: document.getElementById('play-icon'),
      statusText: document.getElementById('status-text'),
      errorMessage: document.getElementById('error-message')
    };

    this.init();
  }

  /**
   * Initialize the widget
   */
  init() {
    console.log('🎵 Initializing Spotify Widget...');
    
    // Bind events
    this.bindEvents();
    
    // Check for existing token
    const token = this.getTokenFromUrl();
    
    if (token) {
      this.accessToken = token;
      this.startWidget();
    } else {
      // Check if we have a stored token
      const storedToken = localStorage.getItem('spotify_access_token');
      const tokenExpiry = localStorage.getItem('spotify_token_expiry');
      
      if (storedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        this.accessToken = storedToken;
        this.startWidget();
      } else {
        this.showLogin();
      }
    }
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (this.elements.loginBtn) {
      this.elements.loginBtn.addEventListener('click', () => this.login());
    }
    
    if (this.elements.refreshBtn) {
      this.elements.refreshBtn.addEventListener('click', () => this.forceRefresh());
    }
    
    if (this.elements.retryBtn) {
      this.elements.retryBtn.addEventListener('click', () => this.retry());
    }

    // Listen for visibility changes to pause/resume updates
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseUpdates();
      } else {
        this.resumeUpdates();
      }
    });
  }

  /**
   * Extract access token from URL hash (OAuth implicit flow)
   */
  getTokenFromUrl() {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial, item) => {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});
    
    // Clear the hash from URL
    window.location.hash = '';
    
    if (hash.access_token) {
      // Store token with expiry (default 1 hour)
      const expiryTime = Date.now() + (hash.expires_in ? parseInt(hash.expires_in) * 1000 : 3600000);
      localStorage.setItem('spotify_access_token', hash.access_token);
      localStorage.setItem('spotify_token_expiry', expiryTime.toString());
      
      console.log('✅ Access token acquired and stored');
      return hash.access_token;
    }
    
    return null;
  }

  /**
   * Redirect to Spotify login
   */
  login() {
    console.log('🔐 Redirecting to Spotify login...');
    
    const params = new URLSearchParams({
      client_id: this.config.CLIENT_ID,
      response_type: 'token',
      redirect_uri: this.config.REDIRECT_URI,
      scope: this.config.SCOPES,
      show_dialog: 'true'
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  /**
   * Start the widget after successful authentication
   */
  async startWidget() {
    console.log('🚀 Starting widget...');
    
    try {
      // Verify token is valid by making a test request
      const testResponse = await this.makeSpotifyRequest('/v1/me');
      
      if (!testResponse.ok) {
        throw new Error('Invalid or expired token');
      }
      
      this.showMainWidget();
      this.startPolling();
      
    } catch (error) {
      console.error('❌ Failed to start widget:', error);
      this.clearStoredToken();
      this.showLogin();
    }
  }

  /**
   * Start polling for currently playing track
   */
  startPolling() {
    console.log('🔄 Starting polling...');
    
    // Initial fetch
    this.fetchNowPlaying();
    
    // Set up interval
    this.refreshInterval = setInterval(() => {
      this.fetchNowPlaying();
    }, this.config.UPDATE_INTERVAL);
  }

  /**
   * Stop polling
   */
  stopPolling() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('⏹️ Polling stopped');
    }
  }

  /**
   * Pause updates (when tab is not visible)
   */
  pauseUpdates() {
    this.stopPolling();
    console.log('⏸️ Updates paused');
  }

  /**
   * Resume updates (when tab becomes visible)
   */
  resumeUpdates() {
    if (this.accessToken) {
      this.startPolling();
      console.log('▶️ Updates resumed');
    }
  }

  /**
   * Make a request to Spotify API
   */
  async makeSpotifyRequest(endpoint, options = {}) {
    const url = `https://api.spotify.com${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    return response;
  }

  /**
   * Fetch currently playing track from Spotify
   */
  async fetchNowPlaying() {
    try {
      const response = await this.makeSpotifyRequest('/v1/me/player/currently-playing');
      
      // Handle different response scenarios
      if (response.status === 204) {
        // No track currently playing
        this.updateUI(null, false);
        return;
      }
      
      if (response.status === 401) {
        // Token expired
        console.warn('⚠️ Token expired, redirecting to login...');
        this.clearStoredToken();
        this.showLogin();
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.item) {
        this.updateUI(data, data.is_playing);
      } else {
        this.updateUI(null, false);
      }
      
    } catch (error) {
      console.error('❌ Error fetching now playing:', error);
      this.showError(`Failed to fetch track info: ${error.message}`);
    }
  }

  /**
   * Update the UI with track information
   */
  updateUI(data, isPlaying) {
    if (!data || !data.item) {
      // No track playing
      this.elements.songTitle.textContent = 'No track playing';
      this.elements.artistName.textContent = 'Open Spotify and play something!';
      this.elements.albumName.textContent = '';
      this.elements.albumCover.src = 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=No+Track';
      this.elements.progressBar.style.width = '0%';
      this.elements.timeElapsed.textContent = '0:00';
      this.elements.timeDuration.textContent = '0:00';
      this.updatePlaybackStatus(false);
      return;
    }

    const track = data.item;
    const progress = data.progress_ms || 0;
    const duration = track.duration_ms;
    
    // Update track info
    this.elements.songTitle.textContent = track.name || 'Unknown Track';
    this.elements.artistName.textContent = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
    this.elements.albumName.textContent = track.album?.name || 'Unknown Album';
    
    // Update album cover
    const imageUrl = track.album?.images?.[0]?.url || 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=No+Image';
    this.elements.albumCover.src = imageUrl;
    
    // Update progress
    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
    this.elements.progressBar.style.width = `${progressPercent}%`;
    this.elements.progressBar.setAttribute('aria-valuenow', progressPercent);
    
    // Update time display
    this.elements.timeElapsed.textContent = this.msToTime(progress);
    this.elements.timeDuration.textContent = this.msToTime(duration);
    
    // Update playback status
    this.updatePlaybackStatus(isPlaying);
    
    // Store current track for comparison
    this.currentTrack = track;
    this.isPlaying = isPlaying;
  }

  /**
   * Update playback status indicator
   */
  updatePlaybackStatus(isPlaying) {
    if (isPlaying) {
      this.elements.playIcon.className = 'fas fa-play me-1';
      this.elements.statusText.textContent = 'Playing';
      this.elements.progressBar.classList.add('progress-bar-animated');
    } else {
      this.elements.playIcon.className = 'fas fa-pause me-1';
      this.elements.statusText.textContent = 'Paused';
      this.elements.progressBar.classList.remove('progress-bar-animated');
    }
  }

  /**
   * Convert milliseconds to mm:ss format
   */
  msToTime(ms) {
    if (!ms || ms < 0) return '0:00';
    
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Force refresh the current track
   */
  forceRefresh() {
    console.log('🔄 Force refreshing...');
    this.elements.refreshBtn.disabled = true;
    
    this.fetchNowPlaying().finally(() => {
      setTimeout(() => {
        this.elements.refreshBtn.disabled = false;
      }, 1000);
    });
  }

  /**
   * Retry connection
   */
  retry() {
    console.log('🔄 Retrying...');
    this.showLoading();
    
    setTimeout(() => {
      if (this.accessToken) {
        this.startWidget();
      } else {
        this.showLogin();
      }
    }, 1000);
  }

  /**
   * Clear stored authentication token
   */
  clearStoredToken() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    this.accessToken = null;
  }

  // UI State Management Methods

  hideAllScreens() {
    Object.values(this.elements).forEach(element => {
      if (element && element.style) {
        element.style.display = 'none';
      }
    });
  }

  showLoading() {
    this.hideAllScreens();
    if (this.elements.loadingScreen) {
      this.elements.loadingScreen.style.display = 'block';
    }
  }

  showLogin() {
    this.hideAllScreens();
    this.stopPolling();
    if (this.elements.loginScreen) {
      this.elements.loginScreen.style.display = 'block';
    }
    console.log('🔐 Showing login screen');
  }

  showMainWidget() {
    this.hideAllScreens();
    if (this.elements.mainWidget) {
      this.elements.mainWidget.style.display = 'block';
    }
    console.log('🎵 Showing main widget');
  }

  showError(message) {
    this.hideAllScreens();
    this.stopPolling();
    
    if (this.elements.errorScreen) {
      this.elements.errorScreen.style.display = 'block';
    }
    
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
    }
    
    console.error('❌ Error:', message);
  }
}

// Initialize the widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎵 DOM loaded, initializing Spotify Widget...');
  window.spotifyWidget = new SpotifyWidget();
});

// Fallback for older browsers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.spotifyWidget) {
      window.spotifyWidget = new SpotifyWidget();
    }
  });
} else {
  window.spotifyWidget = new SpotifyWidget();
}
