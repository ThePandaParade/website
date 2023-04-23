const express = require("express")
require('dotenv').config()
const app = express()
const efu = require("express-fileupload")
var filet = require("file-type")
const path = require('path');
const rawsubdom = Object.keys(require("./domains.json"))

const NodeCache = require('node-cache');
const fetch = require('node-fetch-commonjs');
const cacheDurationSeconds = 60 * 60; // 1 hour in seconds
const weatherCache = new NodeCache({
    stdTTL: cacheDurationSeconds,
    checkperiod: cacheDurationSeconds * 0.2,
    useClones: false
});

// For /time, cache the data for 1 minute
const timeCache = new NodeCache({
    stdTTL: 60,
    checkperiod: 60 * 0.2,
    useClones: false
});

if (process.env.MODE == "PRODUCTION" && process.env.MODE == "DEVELOPMENT") {
    throw new Error("Invalid Proccess Enviorment Mode; Aborting...")
}

app.use(express.static("images"))
app.use(express.static("static"))
app.use(efu({safeFileNames: true}))

app.get('/', (req, res) => {
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
})

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
app.use("/bleeding",require("./web/redesign/redesign.js"))

app.get("/notice/", (req, res) => {
    res.sendFile(path.join(__dirname, "/web/notice.html"))
})



// Weather & Time \\
app.get("/weather", (req, res) => {
    // Make a call to OpenWeatherMap API to get the weather
    // This should use the town defined in the .env file, but if it's not defined, it should default to "London"
    // The API key should be defined in the .env file

    const town = process.env.TOWN || 'London';
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    //console.log(town, apiKey)
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${town}&appid=${apiKey}`;

    // Check if weather data is cached
    const cachedData = weatherCache.get(apiUrl);
    if (cachedData) {
        //console.log(`Serving cached weather data for ${town}`);
        return res.json(cachedData);
    }

    // Otherwise, fetch new weather data and cache it
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //console.log(`Fetching fresh weather data for ${town}`);
            // JSONify the data and send it to the client
            const pre = JSON.parse(JSON.stringify(data));
            // Data for handling the icon from OpenWeatherMap.
            // The icon is a string like "01d" or "04n", which we need to convert to a FontAwesome icon name
            switch (pre.weather[0].icon) {
                case "01d":
                    pre.weather[0].icon = "fas fa-sun";
                    break;
                case "01n":
                    pre.weather[0].icon = "fas fa-moon";
                    break;
                case "02d":
                case "03d":
                    pre.weather[0].icon = "fas fa-cloud-sun";
                    break;
                case "02n":
                case "03n":
                    pre.weather[0].icon = "fas fa-cloud-moon";
                    break;
                case "04d":
                case "04n":
                    pre.weather[0].icon = "fas fa-cloud";
                    break;
                case "09d":
                case "09n":
                    pre.weather[0].icon = "fas fa-cloud-rain";
                    break;
                case "10d":
                case "10n":
                    pre.weather[0].icon = "fas fa-cloud-showers-heavy";
                    break;
                case "11d":
                case "11n":
                    pre.weather[0].icon = "fas fa-bolt";
                    break;
                case "13d":
                case "13n":
                    pre.weather[0].icon = "fas fa-snowflake";
                    break;
                case "50d":
                case "50n":
                    pre.weather[0].icon = "fas fa-smog";
                    break;
            }
            const form = {
                // Round the temperature to the nearest integer
                "temp": Math.round(pre.main.temp),
                "weather": pre.weather[0].main,
                "icon": pre.weather[0].icon
            }
            weatherCache.set(apiUrl, form);
            res.json(form);
        })
        .catch(error => console.error(error));
});

app.get("/time", (req, res) => {
    // Make a call to WorldTime API to get the time
    // Get the time for London.
    // The API key should be defined in the .env file

    const apiUrl = `http://worldtimeapi.org/api/timezone/Europe/London`;

    // Check if time data is cached
    const cachedData = timeCache.get(apiUrl);
    if (cachedData) {
        //console.log(`Serving cached time data for London`);
        return res.json(cachedData);
    }

    // Otherwise, fetch new time data and cache it
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //console.log(`Fetching fresh time data for London`);

            // Send the data as the response
            const pre = JSON.parse(JSON.stringify(data));
            const form = {
                "abbreviation": pre.abbreviation,
                "hour": new Date(pre.datetime).getHours(),
                "minute": new Date(pre.datetime).getMinutes(),
            }
            // Cache the data for later use
            timeCache.set(apiUrl, form);
            res.json(form);
        })
        .catch(error => {console.error(error); res.status(500).send({error: true, code: 500, message: "Internal Server Error"})});
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