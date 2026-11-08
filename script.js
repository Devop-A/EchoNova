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

// Find the button using its ID.
const button = document.getElementById("test-button");

// Find the message paragraph.
const message = document.getElementById("message");

// Listen for a button click.
button.addEventListener("click", function () {
  message.textContent = "Welcome to ECHO NOVA!";
});
