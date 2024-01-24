const express = require("express")
require('dotenv').config()
const app = express.Router()
const path = require('path');

const NodeCache = require('node-cache');
const fetch = require('node-fetch-commonjs');

var cookieParser = require('cookie-parser')
app.use(cookieParser())

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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"))
})

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/about.html"))
})

app.get("/maintenance", (req, res) => {
    res.sendFile(path.join(__dirname, "/maintenance.html"))
})

app.get("/red", (req, res) => {
    res.sendFile(path.join(__dirname, "/red.html"))
})

app.get("/holidays", (req, res) => {
    res.sendFile(path.join(__dirname, "/holidays.html"))
})

app.get("/dms", (req, res) => {
    res.sendFile(path.join(__dirname, "/dms.html"))
})

app.get("/blog/exodus", (req, res) => { // TODO: make an actual FUCKING BLOG SYSTEM
    res.sendFile(path.join(__dirname, "/blog/2024-01-11/exodus.html"))
})

// Support for my Matrix server \\
app.get("/.well-known/matrix/server", (req,res) => {
    res.send({"m.server": "matrix.pandapa.ws:443"})
})

// Support for my Mastodon server \\
app.get(['/.well-known/webfinger*', '/.well-known/host-meta*', '/.well-known/nodeinfo*'], function (req,res) {
    res.status(301).redirect(`https://mastodon.pandapa.ws${req.originalUrl}`)
    }
);

// Moreso pranking links than anything else
app.get("/admin", (req, res) => {
    res.redirect("https://twitter.com/Scratch21Music/status/1635430548314406912?s=20") // Why did I pick the video of Scratch21 saying they have the biggest balls in the world? No idea.
})

app.get("/links/onlyfans", (req, res) => {
    res.redirect("https://tenor.com/en-GB/view/boiled-soundcloud-boiled-boiled-irl-boiled-utsc-boiled-cheesestick-agem-soundcloud-gif-20049996") // amogus
})

// Allow the whole site to use ./static/terminal.css, ./static/avatarAsciiTransparent.png and ./static/terminal.js
// This includes changing the MIME type respectively
app.use("/terminal.css", (req, res) => {res.set("Content-Type", "text/css"); res.sendFile(path.join(__dirname, "/static/terminal.css"));})
app.use("/avatar/transparentAscii", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/avatarAsciiTransparent.png"));})
app.use("/avatar/ascii", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/avatarAscii.png"));})
app.use("/art/blankie", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/blankie.png"));})
app.use("/avatar/normal", (req, res) => {res.set("Content-Type", "image/jpg"); res.sendFile(path.join(__dirname, "/static/avatar.jpg"));})
app.use("/terminal.js", (req, res) => {res.set("Content-Type", "text/javascript"); res.sendFile(path.join(__dirname, "/static/terminal.js"));})
app.use("/art/comfy", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/comf.png"));})
app.use("/art/comfy-noise", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/comf-noise.png"));})
app.use("/branding/banner", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/banner.png"));})
app.use("/art/parade", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/wah_parade.png"));})

// Yeah one day I'll make this automated. Not today though.
// 2024-01-11 related assets
app.use("/blog/2024-01-11/desktop", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/blog/2024-01-11/desktop.png"));})

// Weather & Time \\
app.get("/internal/weather", (req, res) => {
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

app.get("/internal/time", (req, res) => {
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
                "hour": new Date(pre.datetime).getHours().toString().padStart(2, "0"),
                "minute": new Date(pre.datetime).getMinutes().toString().padStart(2, "0")
            }
            // Cache the data for later use
            timeCache.set(apiUrl, form);
            res.json(form);
        })
        .catch(error => {console.error(error); res.status(500).send({error: true, code: 500, message: "Internal Server Error"})});
})

// 404 handler
app.use((req, res, next) => {
    // Render the 404 page
    // However, if this is a request to any url with "/error/" in it, then don't redirect to the 404 page
    // And if this is a request to any url with "/" in it, then redirect to /error/404/
    if (req.url.includes("/error/") || req.url.includes("/maintenance")) {
        next()
    } else if (req.url.includes("/bleeding")) {
    // Any requests to bleeding edge code get sent to the respective error handler.
       res.redirect("/bleeding/error/404/")
    } else {
        res.redirect("/error/404/")
    }
})

// Error handler
app.use((err, req, res, next) => {
    try {
        // Render the error page
        if (err.status == undefined) {
            res.redirect("/error/500/") // If this happens its a big oopsie
        }
        res.status(err.status.toNumber())
        res.redirect("/error/" + err.status)
    } catch (err) {
        console.log(err)
        res.redirect("/error/500/") 
    }
})

app.get("/error/:status", (req, res) => {
    res.status(req.params.status)
    res.sendFile(path.join(__dirname, "/error.html"))
})

module.exports = app
