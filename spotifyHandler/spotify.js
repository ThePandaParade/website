// Maintainer: @WhenDawnEnds
// Last updated: 2022-07-16

require("dotenv").config()
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require("fs")
const chalk = require("chalk")

const express = require("express")
require('dotenv').config()
const app = express.Router()
const path = require('path');

const NodeCache = require('node-cache');
const playingCache = new NodeCache({
    stdTTL: 30,
    checkperiod: 30 * 0.2,
    useClones: false
});
let spotify;
let hasInit = false;

function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

async function preRun() {
    spotify = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.SPOTIFY_REDIRECT_URI + process.env.SPOTIFY_REDIRECT_ROUTE
    })
    const tokenFile = await fs.readFileSync("./SPOTIFY_TOKEN")
    spotify.setAccessToken(tokenFile.toString().split("|")[0])
    spotify.setRefreshToken(tokenFile.toString().split("|")[1])

    // Start a thread which refreshes the token every 10 minutes.
    setInterval(() => {
        spotify.refreshAccessToken((err, data) => {
            if (err) {
                console.log(chalk.red("[Spotify]") + " Error refreshing access token: " + err)
            } else {
                spotify.setAccessToken(data.body.access_token)
                // Write the new token to the file.
                const tokenFile = fs.readFileSync("./SPOTIFY_TOKEN")
                fs.writeFileSync("./SPOTIFY_TOKEN", `${data.body.access_token}|${tokenFile.toString().split("|")[1]}|${Date.now()}`)
            }
        })
    }, 600000)

    hasInit = true

    return spotify
}

async function run() {
    let final = ""

    // Check if there is a cached result, and if so, return it.
    if (playingCache.get("playing") !== undefined) {
        return playingCache.get("playing")
    }

    const track = await spotify.getMyCurrentPlayingTrack()
    // Nothing is playing right now
    if (track.body == null||track.body.item == undefined) {
        final = "⏹ Nothing playing."
    } else {
        const progressFormatted = fmtMSS(~~(track.body.progress_ms / 1000))
        const durationFormatted = fmtMSS(~~(track.body.item.duration_ms / 1000))

        // Check if the song is paused.
        if (track.body.is_playing == false) {
            final = `⏸ ${track.body.item.artists[0].name} - ${track.body.item.name}`
        } else {
            final = `▶ ${track.body.item.artists[0].name} - ${track.body.item.name} (${progressFormatted} - ${durationFormatted})`
        }
    }

    // Cache the result.
    playingCache.set("playing", final)
    // Then pass it.
    return final
}

// Main endpoint. This will return the currently playing song (or "Error" if there is an error)
app.get("/run", async (req, res) => {
    if (!hasInit) {
        await preRun()
        hasInit = true
    }
    res.send(await run())
})

module.exports = app