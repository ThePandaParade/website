// 🔪🩸 Code \\

const express = require("express")
require('dotenv').config()
const app = express.Router()
const path = require('path');

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

// 404 handler
app.use((req, res, next) => {
    // Render the 404 page
    // However, if this is a request to any url with "/error/" in it, then don't redirect to the 404 page
    // And if this is a request to any url with "/bleeding/" in it, then redirect to /bleeding/error/404/
    if (req.url.includes("/error/") || req.url.includes("/maintenance")) {
        next()
    } else if (req.url.includes("/bleeding/")) {
       res.redirect("/bleeding/error/404/")
    } else {
        // Until I actually finish the redesign, I'm going to redirect to /bleeding/error/404/
        res.redirect("/bleeding/error/404/")
    }
})

app.use((err, req, res, next) => {
    // Render the error page
    res.redirect("/bleeding/error/" + err.status)
})

// Error handler
app.use((err, req, res, next) => {
    try {
        // Render the error page
        if (err.status == undefined) {
            res.redirect("/bleeding/error/500/") // If this happens its a big oopsie
        }
        res.redirect("/bleeding/error/" + err.status)
    } catch (err) {
        console.log(err)
        res.redirect("/bleeding/error/500/") 
    }
})

app.get("/error/:status", (req, res) => {
    res.status(req.params.status)
    res.sendFile(path.join(__dirname, "/error.html"))
})

module.exports = app