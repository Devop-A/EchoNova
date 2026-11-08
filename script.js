console.log("ECHO NOVA loaded successfully");

// Initialize Lucide icons
if (window.lucide) {
    lucide.createIcons();
} else {
    console.error("Lucide failed to load.");
}

// Find the button using its ID.
const button = document.getElementById("test-button");

// Find the message paragraph.
const message = document.getElementById("message");

// Listen for a button click.
button.addEventListener("click", function () {

    message.textContent = "Welcome to ECHO NOVA!";
    });