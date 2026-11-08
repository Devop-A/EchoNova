console.log("ECHO NOVA loaded successfully");
// Find the button using its ID.
const button = document.getElementById("test-button");

// Find the message paragraph.
const message = document.getElementById("message");

// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
} else {
  console.error("Lucide failed to load.");
}

// ====================================
// ECHO NOVA - MUSIC PLAYER
// ====================================

// Find our HTML elements
const audio = document.getElementById("audio-player");

const playButton = document.getElementById("player-play");

const playIcon = document.getElementById("player-play-icon");

const pauseIcon = document.getElementById("player-pause-icon");

// Set our starting volume to 80%
audio.volume = 0.8;

function updatePlayButton() {
  // Check whether audio is playing
  const isPlaying = !audio.paused && !audio.ended;

  // Switch between Play and Pause icons
  playIcon.classList.toggle("hidden", isPlaying);

  pauseIcon.classList.toggle("hidden", !isPlaying);

  // Get the current song title directly from HTML
  const currentTitle = document
    .getElementById("player-title")
    .textContent.trim();

  // Update the button label
  playButton.setAttribute(
    "aria-label",
    isPlaying ? `Pause ${currentTitle}` : `Play ${currentTitle}`,
  );
}

// Play or pause the current song
async function togglePlayback() {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  } else {
    audio.pause();
  }
}

// Listen for button clicks
playButton.addEventListener("click", togglePlayback);

// Listen for changes in audio playback
audio.addEventListener("play", updatePlayButton);

audio.addEventListener("pause", updatePlayButton);

audio.addEventListener("ended", updatePlayButton);

// Set the initial button appearance
updatePlayButton();

// ====================================
// ECHO NOVA - PROGRESS BAR
// ====================================

// Get the progress bar and time displays
const progressSlider = document.getElementById("player-progress");

const currentTimeLabel = document.getElementById("player-current-time");

const durationLabel = document.getElementById("player-duration");

// Convert seconds into minutes:seconds
function formatTime(seconds) {
  // Protect against missing or invalid time values
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

// Update the progress bar and timestamps
function updateProgress() {
  const currentTime = audio.currentTime;

  const duration = audio.duration;

  // Display the current playback time
  currentTimeLabel.textContent = formatTime(currentTime);

  // Check whether we know the song duration
  if (Number.isFinite(duration) && duration > 0) {
    // Display the total track duration
    durationLabel.textContent = formatTime(duration);

    // Calculate playback progress as a percentage
    const percentage = (currentTime / duration) * 100;

    // Update the progress slider
    progressSlider.value = percentage;
  } else {
    durationLabel.textContent = "0:00";

    progressSlider.value = 0;
  }
}

// Allow users to seek through the track
progressSlider.addEventListener("input", function () {
  const duration = audio.duration;

  // Only seek when the duration is known
  if (Number.isFinite(duration) && duration > 0) {
    const percentage = Number(progressSlider.value);

    // Convert slider percentage into seconds
    audio.currentTime = (percentage / 100) * duration;

    updateProgress();
  }
});

// Update progress when metadata loads
audio.addEventListener("loadedmetadata", updateProgress);

// Update progress if the duration changes
audio.addEventListener("durationchange", updateProgress);

// Update progress while music plays
audio.addEventListener("timeupdate", updateProgress);

// Update the display after seeking
audio.addEventListener("seeked", updateProgress);

// Reset the display if the audio source is cleared
audio.addEventListener("emptied", updateProgress);

// Initialize the progress display
updateProgress();

// ====================================
// ECHO NOVA - VOLUME CONTROLS
// ====================================

// Find our HTML elements
const volumeSlider = document.getElementById("player-volume");

const muteButton = document.getElementById("player-mute");

const volumeOnIcon = document.getElementById("volume-on-icon");

const volumeOffIcon = document.getElementById("volume-off-icon");

// Update our volume controls
function updateVolumeControls() {
  // Determine whether audio is effectively silent
  const isMuted = audio.muted || audio.volume === 0;

  // Update the slider to match the actual volume
  volumeSlider.value = audio.volume;

  // Show the correct speaker icon
  volumeOnIcon.classList.toggle("hidden", isMuted);

  volumeOffIcon.classList.toggle("hidden", !isMuted);

  // Update accessibility information
  muteButton.setAttribute(
    "aria-label",
    isMuted ? "Unmute audio" : "Mute audio",
  );

  muteButton.setAttribute("aria-pressed", String(isMuted));
}

// Change volume when the slider moves
volumeSlider.addEventListener("input", function () {
  // Read the slider value as a number
  const newVolume = Number(volumeSlider.value);

  // Apply the new volume to our audio
  audio.volume = newVolume;

  // Moving the slider also unmutes the audio
  audio.muted = false;
});

// Toggle mute when the speaker button is clicked
muteButton.addEventListener("click", function () {
  // If volume is zero, restore it to 80%
  if (audio.volume === 0) {
    audio.volume = 0.8;
    audio.muted = false;
  } else {
    // Otherwise, toggle between muted and unmuted
    audio.muted = !audio.muted;
  }
});

// Keep the controls synchronized
audio.addEventListener("volumechange", updateVolumeControls);

// Set the initial appearance
updateVolumeControls();

// ====================================
// ECHO NOVA - PLAYLIST
// ====================================

// Our three available songs
const tracks = [
  {
    id: "midnight-frequencies",
    title: "Midnight Frequencies",
    artist: "ECHO NOVA",
    audio: "assets/audio/midnight-frequencies.wav",
    artwork: "assets/images/midnight-frequencies.png",
  },

  {
    id: "neon-ghosts",
    title: "Neon Ghosts",
    artist: "ECHO NOVA",
    audio: "assets/audio/neon-ghosts.wav",
    artwork: "assets/images/neon-ghosts.png",
  },

  {
    id: "afterglow-static",
    title: "Afterglow Static",
    artist: "ECHO NOVA",
    audio: "assets/audio/afterglow-static.wav",
    artwork: "assets/images/afterglow-static.png",
  },
];

// Get the player elements
const playerTitle = document.getElementById("player-title");

const playerArtwork = document.getElementById("player-artwork");

const previousButton = document.getElementById("player-previous");

const nextButton = document.getElementById("player-next");

// Load a song into our music player
function loadTrack(index, playImmediately = false) {
  // Find the requested song in our playlist
  const track = tracks[index];

  // Stop if the track doesn't exist
  if (!track) {
    return;
  }

  // Pause the current audio before switching
  audio.pause();

  // Remember which track is selected
  currentTrackIndex = index;

  // Change the audio source
  audio.src = track.audio;

  // Load the new audio information
  audio.load();

  // Update the player title
  playerTitle.textContent = track.title;

  // Update the album artwork
  playerArtwork.src = track.artwork;

  playerArtwork.alt = `${track.title} album artwork`;

  // Reset the visual displays
  updateProgress();
  updatePlayButton();

  // Start playback when requested
  if (playImmediately) {
    togglePlayback();
  }
}

// ====================================
// PREVIOUS / NEXT CONTROLS
// ====================================

// Go to the previous track
previousButton.addEventListener("click", function () {
  let previousIndex = currentTrackIndex - 1;

  // If we're at the first song, wrap to the last
  if (previousIndex < 0) {
    previousIndex = tracks.length - 1;
  }

  loadTrack(previousIndex, true);
});

// Go to the next track
nextButton.addEventListener("click", function () {
  let nextIndex = currentTrackIndex + 1;

  // If we're at the last song, wrap to the first
  if (nextIndex >= tracks.length) {
    nextIndex = 0;
  }

  loadTrack(nextIndex, true);
});

// Keep track of which song is selected
let currentTrackIndex = 0;

// ====================================
// MUSIC CARD PLAY BUTTONS
// ====================================

// Find all the album-card Play buttons
const musicCardButtons = document.querySelectorAll(
  '[data-action="play"][data-track]',
);

// Add a click listener to each button
musicCardButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    // Read which track this button belongs to
    const trackId = button.dataset.track;

    // Find the matching song in our playlist
    const selectedIndex = tracks.findIndex(function (track) {
      return track.id === trackId;
    });

    // Stop if no matching track exists
    if (selectedIndex === -1) {
      console.error("Track not found:", trackId);
      return;
    }

    // If this song is already selected, toggle Play/Pause
    if (selectedIndex === currentTrackIndex) {
      togglePlayback();
    } else {
      // Otherwise, select and play the requested song
      loadTrack(selectedIndex, true);
    }
  });
});

// ====================================
// AUTOMATIC TRACK ADVANCE
// ====================================

audio.addEventListener("ended", function () {
  // Calculate the next track index
  let nextIndex = currentTrackIndex + 1;

  // Wrap back to the beginning if necessary
  if (nextIndex >= tracks.length) {
    nextIndex = 0;
  }

  // Load and play the next track
  loadTrack(nextIndex, true);
});

// Set our initial song
loadTrack(0);

// ====================================
// ECHO NOVA - FAVORITES SYSTEM
// ====================================

// The name we'll use for browser storage
const FAVORITES_STORAGE_KEY = "echo-nova-favorites";

// Array containing the IDs of favorite songs
let favorites = [];

// 1. LOAD SAVED FAVORITES
try {
  const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);

  if (savedFavorites !== null) {
    const parsedFavorites = JSON.parse(savedFavorites);

    // Make sure the saved value is actually an array
    if (Array.isArray(parsedFavorites)) {
      // Keep only IDs that exist in our playlist
      favorites = parsedFavorites.filter(function (id) {
        return tracks.some(function (track) {
          return track.id === id;
        });
      });
    }
  }
} catch (error) {
  console.warn("Could not load saved favorites:", error);
}

// 2. FIND ALL FAVORITE BUTTONS
const favoriteButtons = document.querySelectorAll(
  '[data-action="favorite"][data-track]',
);

// 3. SAVE FAVORITES TO THE BROWSER
function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Could not save favorites:", error);
  }
}

// 4. UPDATE THE HEART ICONS
function updateFavoriteButtons() {
  favoriteButtons.forEach(function (button) {
    const trackId = button.dataset.track;

    const isFavorite = favorites.includes(trackId);

    // Find this song's title
    const track = tracks.find(function (song) {
      return song.id === trackId;
    });

    if (!track) {
      return;
    }

    // Update the toggle's accessibility state
    button.setAttribute("aria-pressed", String(isFavorite));

    button.setAttribute(
      "aria-label",
      isFavorite
        ? `Remove ${track.title} from favorites`
        : `Add ${track.title} to favorites`,
    );

    // Lucide replaces our <i> with an <svg>
    const heartIcon = button.querySelector("svg");

    if (heartIcon) {
      // Pink when saved, original color otherwise
      heartIcon.style.color = isFavorite ? "#f472b6" : "";

      // Filled heart when saved, outline otherwise
      heartIcon.style.fill = isFavorite ? "currentColor" : "none";
    }
  });
}

// 5. LISTEN FOR FAVORITE BUTTON CLICKS
favoriteButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const trackId = button.dataset.track;

    // Only accept songs in our playlist
    const trackExists = tracks.some(function (track) {
      return track.id === trackId;
    });

    if (!trackExists) {
      return;
    }

    if (favorites.includes(trackId)) {
      // Remove an existing favorite
      favorites = favorites.filter(function (id) {
        return id !== trackId;
      });
    } else {
      // Add a new favorite
      favorites.push(trackId);
    }

    // Save the updated list
    saveFavorites();

    // Update the heart icons
    updateFavoriteButtons();
  });
});

// 6. DISPLAY SAVED FAVORITES ON PAGE LOAD
updateFavoriteButtons();

// ====================================
// ECHO NOVA - EXPANDABLE MOBILE PLAYER
// ====================================

// Get the mobile player elements
const mobileExpandButton = document.getElementById("player-expand");

const mobileExpandIcon = document.getElementById("player-expand-icon");

const mobilePlayerPanel = document.getElementById("mobile-player-panel");

// Open or close the mobile panel
function setMobilePlayerOpen(isOpen) {
  // Show or hide the panel
  mobilePlayerPanel.classList.toggle("hidden", !isOpen);

  // Rotate the arrow when open
  mobileExpandIcon.classList.toggle("rotate-180", isOpen);

  // Update accessibility information
  mobileExpandButton.setAttribute("aria-expanded", String(isOpen));

  mobileExpandButton.setAttribute(
    "aria-label",
    isOpen ? "Collapse music player" : "Expand music player",
  );
}

// Handle clicks on the expansion button
mobileExpandButton.addEventListener("click", function () {
  // Read the current state
  const isOpen = mobileExpandButton.getAttribute("aria-expanded") === "true";

  // Switch to the opposite state
  setMobilePlayerOpen(!isOpen);
});

// ====================================
// MOBILE PLAYER - AUDIO SYNCHRONIZATION
// ====================================

// Get the expanded panel elements
const mobileArtwork = document.getElementById("mobile-player-artwork");

const mobileTitle = document.getElementById("mobile-player-title");

const mobileTime = document.getElementById("mobile-player-time");

const mobileVolume = document.getElementById("mobile-player-volume");

const mobileMuteButton = document.getElementById("mobile-player-mute");

const mobileVolumeOnIcon = document.getElementById("mobile-volume-on-icon");

const mobileVolumeOffIcon = document.getElementById("mobile-volume-off-icon");

// Keep the mobile panel synchronized with the main player
function updateMobilePlayer() {
  // Copy current track information
  mobileArtwork.src = playerArtwork.src;

  mobileArtwork.alt = playerArtwork.alt;

  mobileTitle.textContent = playerTitle.textContent;

  // Display current time and duration
  mobileTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;

  // Match the main player's volume
  mobileVolume.value = audio.volume;

  const isSilent = audio.muted || audio.volume === 0;

  // Show the correct volume icon
  mobileVolumeOnIcon.classList.toggle("hidden", isSilent);

  mobileVolumeOffIcon.classList.toggle("hidden", !isSilent);

  mobileMuteButton.setAttribute(
    "aria-label",
    isSilent ? "Unmute audio" : "Mute audio",
  );
}

// Change volume from the expanded panel
mobileVolume.addEventListener("input", function () {
  audio.volume = Number(mobileVolume.value);

  audio.muted = false;
});

// Mute and unmute using the mobile button
mobileMuteButton.addEventListener("click", function () {
  if (audio.volume === 0) {
    audio.volume = 0.8;
    audio.muted = false;
  } else {
    audio.muted = !audio.muted;
  }
});

// Synchronize when a new track begins loading
audio.addEventListener("loadstart", updateMobilePlayer);

// Synchronize when track metadata becomes available
audio.addEventListener("loadedmetadata", updateMobilePlayer);

// Synchronize timestamps during playback
audio.addEventListener("timeupdate", updateMobilePlayer);

// Synchronize volume and mute changes
audio.addEventListener("volumechange", updateMobilePlayer);

// Set the initial mobile player information
updateMobilePlayer();

// ====================================
// ECHO NOVA - MOBILE NAVIGATION
// ====================================

// Find our mobile navigation elements
const mobileMenuButton = document.getElementById("mobile-menu-button");

const mobileNav = document.getElementById("mobile-nav");

const mobileMenuOpenIcon = document.getElementById("mobile-menu-open-icon");

const mobileMenuCloseIcon = document.getElementById("mobile-menu-close-icon");

// Function to open or close the mobile menu
function setMobileMenuOpen(isOpen) {
  // Show or hide the navigation dropdown
  mobileNav.classList.toggle("hidden", !isOpen);

  // Switch between the Menu and X icons
  mobileMenuOpenIcon.classList.toggle("hidden", isOpen);

  mobileMenuCloseIcon.classList.toggle("hidden", !isOpen);

  // Update the button's accessibility information
  mobileMenuButton.setAttribute("aria-expanded", String(isOpen));

  mobileMenuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu",
  );
}

// Open or close the menu when the button is clicked
mobileMenuButton.addEventListener("click", function () {
  // Check if the menu is already open
  const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";

  // Switch to the opposite state
  setMobileMenuOpen(!isOpen);
});

// Make sure the menu starts closed
setMobileMenuOpen(false);

// ====================================
// CLOSE MENU AFTER NAVIGATION
// ====================================

// Find all links inside our mobile navigation
const mobileNavLinks = mobileNav.querySelectorAll("a");

// Add a click listener to each navigation link
mobileNavLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    // Close the menu after selecting a section
    setMobileMenuOpen(false);
  });
});

// ====================================
// MOBILE MENU KEYBOARD SUPPORT
// ====================================

// Close the navigation menu when Escape is pressed
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      setMobileMenuOpen(false);

      // Return keyboard focus to the menu button
      mobileMenuButton.focus();
    }
  }
});

// ====================================
// MOBILE MENU RESPONSIVE BEHAVIOR
// ====================================

window.addEventListener("resize", function () {
  // Tailwind's md breakpoint starts at 768px
  if (window.innerWidth >= 768) {
    setMobileMenuOpen(false);
  }
});

// Close the menu when clicking outside it
document.addEventListener("click", function (event) {
  const clickedInsideMenu = mobileNav.contains(event.target);

  const clickedMenuButton = mobileMenuButton.contains(event.target);

  if (!clickedInsideMenu && !clickedMenuButton) {
    setMobileMenuOpen(false);
  }
});
