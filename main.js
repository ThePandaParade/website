const express = require("express")
require('dotenv').config()
const app = express()
const efu = require("express-fileupload")
var filet = require("file-type")
const path = require('path');
const rawsubdom = Object.keys(require("./domains.json"))
const geoip = require("geoip-lite")
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
app.use((req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const country = geoip.lookup(ip)?.country;
    const region = geoip.lookup(ip)?.region;
    const city = geoip.lookup(ip)?.city;
    if ((embargo.includes(country) || embargo.includes(region) || embargo.includes(city)) && req.url !== '/bleeding/error/451') {
        console.log(`Blocked request from ${country} - ${ip}`)
        res.redirect('/bleeding/error/451');
    } else {
        next();
    }
});


// Redesign \\
app.use("/",require("./web/redesign/redesign.js"))

/* app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/web/root.html"))
})

app.get('/devices', (req,res) => {
    res.sendFile(path.join(__dirname, "/web/devices.html"))
})

app.get("/holidays", (req, res) => {
    res.sendFile(path.join(__dirname, "/web/holidays.html"))
})

app.get("/links/onlyfans", (req, res) => {
    res.send(`
    <head> <meta property="og:title" content="Onlyfans"> 
    <meta property="og:description" content="OnlyFans is the social platform revolutionizing creator and fan connections. The site is inclusive of artists and content creators from all genres and allows them to monetize their content while developin...">
    </head> <script> window.location.replace("https://www.youtube.com/watch?v=xm3YgoEiEDc") </script>
    `)
}) */

app.get("/links/twitter", (req, res) => {
    res.redirect("https://twitter.com/WhenDawnEnds")
})

app.get("/links/github", (req, res) => {
    res.redirect("https://github.com/WhenDawnEnds")
})

app.get("/links/telegram", (req, res) => {
    res.redirect("https://t.me/WhenDawnEnds")
})

app.get("/links/patreon", (req, res) => {
    res.redirect("https://www.patreon.com/robynsnest")
})

app.get("/links/mastodon", (req, res) => {
    res.redirect("https://jackelope.gay/@robyndawn")
})

app.get("/links/projects/frostbyte", (req, res) => {
    res.redirect("https://frostbyte.jackelope.gay")
})

app.get("/links/projects/twb", (req, res) => {
    res.redirect("https://www.youtube.com/channel/UCiXbaS2cQl58NlHl6gWRvqQ")
})


// Bleeding Edge \\
// Redesign Zone \\

app.get("/notice/", (req, res) => {
    res.sendFile(path.join(__dirname, "/web/notice.html"))
})





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