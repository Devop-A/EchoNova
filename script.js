console.log("ECHO NOVA loaded successfully");

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

// Update the Play/Pause button appearance
function updatePlayButton() {
  const isPlaying = !audio.paused && !audio.ended;

  // Hide Play while music is playing
  playIcon.classList.toggle("hidden", isPlaying);

  // Show Pause while music is playing
  pauseIcon.classList.toggle("hidden", !isPlaying);

  // Update the accessible button label
  playButton.setAttribute(
    "aria-label",
    isPlaying ? "Pause Midnight Frequencies" : "Play Midnight Frequencies",
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

// Find the button using its ID.
const button = document.getElementById("test-button");

// Find the message paragraph.
const message = document.getElementById("message");

// Listen for a button click.
button.addEventListener("click", function () {
  message.textContent = "Welcome to ECHO NOVA!";
});
