const express = require("express")
require('dotenv').config()
const app = express()
const efu = require("express-fileupload")
var filet = require("file-type")
const path = require('path');
const rawsubdom = Object.keys(require("./domains.json"))
const geoip = require("geoip-lite")
const fetch = require("node-fetch-commonjs")
const fs = require("fs")
const embargo = [
    // Embargoed countries, subdivisions or cities. (https://en.wikipedia.org/wiki/Embargo#List_of_countries_under_embargo)
    // This can also be regions under sanctions (https://en.wikipedia.org/wiki/International_sanctions#Sanctioned_countries), typically diplomatic/military sanctions.
    // This is a list of countries that we will block from accessing any of our services.
    // This is because I am UK-based, and I do not want to be breaking any laws, or be in any legal trouble.
    // Especially since I do plan on hosting a shop on this domain later on.

    // Format: ISO 3166-1 alpha-2 country code (https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)
    "RF", // Russia
    "KP", // North Korea
    "IR", // Iran
    "CN", // China (People's Republic of)
    // Last updated: 2023-05-18
    // If a legal representative wants to add/remove a country to this list, please contact me via email (robyn@pandapa.ws). 
]

if (process.env.MODE == "PRODUCTION" && process.env.MODE == "DEVELOPMENT") {
    throw new Error("Invalid Proccess Enviorment Mode; Aborting...")
}

app.use(express.static("images"))
app.use(express.static("static"))
app.use(efu({safeFileNames: true}))

// Geoblocking \\
/* app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const country = geoip.lookup(ip)?.country;
    const region = geoip.lookup(ip)?.region;
    const city = geoip.lookup(ip)?.city;
    if ((embargo.includes(country) || embargo.includes(region) || embargo.includes(city)) && req.url !== '/error/451') {
        console.log(`Blocked request from ${country} - ${ip}`)
        res.redirect('/error/451');
    } else {
        next();
    }
}); */


app.use(async (req,res,next) => {
    // Block the ByteDance and ByteSpider UserAgents. This is due to the aggresive nature of the web spider.
    // and plus, fuck tiktok.
    let useragent = req.headers['user-agent']
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (useragent.toLowerCase().includes("bytedance") || useragent.toLowerCase().includes('bytespider')) {
        let lookup = geoip.lookup(ip)
        res.send("<h1>Forbidden.</h1><h2>Malicious User Agent - please verify browser integrity.</h2><h5>This incident has been logged.</h5>")
        const snipeStream = fs.createWriteStream("snipe.log", {flags: "a+"})

        // After we send them to a blank page, we log their user agent, IP, origin country, etc.
        await snipeStream.write(`Request refused:
\nUA: ${useragent}
\nOrigin Country: ${lookup?.city}, ${lookup?.region}, ${lookup?.country}
\nIP: ${ip}
\nTime: ${new Date().toLocaleTimeString()} ${new Date().toLocaleDateString()}
##########################################\n`)
        snipeStream.end()

        // We also send a webhook message to discord.
        const response = await fetch(process.env.DISCORD_WEBHOOK, {
            method: "POST",
            body: JSON.stringify({
                "embeds": [
                  {
                    "title": `ByteDance / ByteSpider UserAgent Prevented`,
                    "color": 0xff00e1,
                    "fields": [
                      {
                        "name": `User Agent`,
                        "value": useragent
                      },
                      {
                        "name": `Originating Country`,
                        "value": `${lookup?.city}, ${lookup?.region}, ${lookup?.country}`,
                        "inline": true
                      },
                      {
                        "name": `IP`,
                        "value": `${ip}`,
                        "inline": true
                      }
                    ],
                    "timestamp": `${Date.now()}`
                  }
                ]
              }),
            headers: {"Content-Type": "application/json"}
        })
        const data = await response.json()
        console.log(data)
    }
    else { // They're clean
        next()
    }
})

// Endpoint for testing any sort of blocking.
app.get("/test", (req, res) => {
    res.send("Hello, world!")
})

app.get("/links/twitter", (req, res) => {
    res.redirect("https://twitter.com/WhenDawnEnds")
})

app.get("/links/github", (req, res) => {
    res.redirect("https://github.com/WhenDawnEnds")
})

app.get("/links/telegram", (req, res) => {
    res.redirect("https://t.me/robynsspacestation")
})

app.get("/links/patreon", (req, res) => {
    res.redirect("https://www.patreon.com/robynsnest")
})

app.get("/links/mastodon", (req, res) => {
    res.redirect("https://mastodon.pandapa.ws/@me")
})

app.get("/links/steam", (req, res) => {
    res.redirect("https://steamcommunity.com/id/WhenDawnEnds/")
})

app.get("/links/throne", (req, res) => {
    res.redirect("https://throne.com/whendawnends")
})

app.get("/links/twitch", (req, res) => {
    res.redirect("https://twitch.tv/purplegayenby")
})

// Optional import: Spotify \\
if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_ENABLED) { // Check if the Spotify client ID is defined in the .env file
    console.log("Spotify client ID found. Starting Spotify handler...")
    app.use("/spotify", require("./spotifyHandler/spotify.js"))
}

// Redesign \\
app.use("/",require("./web/redesign.js"))



// Deprecated Zone \\
app.post('/upload', (req, res) => {
    if (req.headers.authorization !== process.env.IMAGE_SERVER) {
        return res.status(401).send({'error': true, 'code': 401})
    }
    
    if (!req.files) {
        return res.status(400).send({'error': true, 'code': 400})
    }

    let uploadImg = req.files.upImg
    let ogName = uploadImg.name
    const buffer = uploadImg.data.slice(0, filet.minimumBytes); 
    let exte = filet(buffer).ext
    let chosenDomain = rawsubdom[rawsubdom.length * Math.random() << 0]
    ogName = ogName.replace(exte,"")
    
    if (process.env.MODE == "PRODUCTION") {
        uploadImg.mv(`images/${ogName}.${exte}`)
        res.send(`https://${chosenDomain}/${ogName}.${exte}`)
    }
    else {
        console.debug("Recieved request to upload image")
        console.debug(`Image name: ${ogName}`)
        console.debug(`Image extension: ${exte}`)
        console.debug(`Image domain: ${chosenDomain}`)
    }
})


// Start an auto-updating server \\

setTimeout(() => {
    const { exec } = require("child_process")
    exec("git pull", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`)
            return
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
        }
        if (stdout.includes("Already up to date.")) {
            return
        }
        
        console.log(`stdout: ${stdout}`)
    })
}, 1000)

// Start the server \\

const server = app.listen(process.env.PORTFOLIO, () => console.log(`Listening to port ${process.env.PORTFOLIO}`))

// Graceful Shutdown \\
process.on('SIGTERM', () => {
    console.log("Shutting down...")
    server.close(() => console.log("Closed all connections"))
    process.exit(0)
})