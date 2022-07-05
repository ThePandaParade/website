// Authenticates with Spotify to change Twitter location to Currently Playing.
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
//const { TwitterApi } = require('twitter-api-v2');
const fetch = require('node-fetch');

if (!(fs.readFileSync("./spotify/ACCESS_TOKEN")) && !process.env.SKIP_TOKEN_CHECK) {  
    console.log("Spotify Token not found.")
    console.log("Please run 'npm run get-spotify-token' to get a token.")
    process.exit(1)
}

if (!(fs.readFileSync("./spotify/TWITTER_TOKEN")) && !process.env.SKIP_TOKEN_CHECK) {
    console.log("Twitter Token not found.")
    console.log("Please run 'npm run get-twitter-token' to get a token.")
    process.exit(1)
}

// Authenticate through Spotify
const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
})

SpotifyApi.setAccessToken(fs.readFileSync("./spotify/ACCESS_TOKEN"))
SpotifyApi.setRefreshToken(fs.readFileSync("./spotify/REFRESH_TOKEN"))

// Authenticate through Twitter

const twitter = new TwitterApi(process.env.TWITTER_BEARER_TOKEN)
const v1Client = twitter.v1
const v2Client = twitter.v2

module.exports = async function() {
    
    let final = ""
    const track = await SpotifyApi.getMyCurrentPlayingTrack()
    // Check if anything is playing
    if (track.body.item == undefined) {
        final = "Nothing is playing"
    }
    else {
        // Get track info
        const track_name = track.body.item.name
        const track_artist = track.body.item.artists[0].name
        final = `${track_name} by ${track_artist}`
    }
    // Update on Twitter

    // On Development, send out a tweet instead of updating the bio.
    if (process.env.MODE == "DEVELOPMENT") {
        console.log("Sending tweet instead of updating bio.")

        await v2Client.tweet("Testing tweet from Twitter.js\n" + final)
    }
}

module.exports()