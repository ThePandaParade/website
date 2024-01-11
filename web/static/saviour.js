// saviour.js \\
// Not religious, just a cool name for a file.
// Handles the Twitch redebut page, including the music and the banner.

// IDs \\
// saviour - The banner
// ok - The OK button
// title - The title of the window/banner
// paragraph - The paragraph of the window/banner

// Import the music
const saviour = new Audio("/redebut/saviour");

// When the OK button is clicked, play the music and hide the banner
function ok() {
    // Set variables for the title and paragraph
    const title = document.getElementById("title");
    const paragraph = document.getElementById("paragraph");
    // Hide the OK button
    document.getElementById("ok").style.display = "none";
    // Set a new title and paragraph, and wait 3 seconds.
    title.innerHTML = "<h3>Where is your saviour now?</h3>";
    paragraph.innerHTML = "<h4>The stream will start soon.<br>January 6 2024, 18:00 GMT<br><a href=\"https://twitch.tv/PurpleGayEnby\">https://twitch.tv/PurpleGayEnby</a></h4>";
     // Set the volume to 25%
    saviour.volume = 0.25;
    // Play the music
    saviour.play();

    // Set cookie to prevent the banner from showing again for 1 week
    document.cookie = "saviour=true; max-age=604800";

    // Once the music has finished playing, redirect the user to the homepage
    saviour.onended = function() {
        window.location.href = "/";
    }
}

// Assign functions on page load to prevent errors
window.onload = function() {
    document.getElementById("ok").addEventListener("click", ok);
}