// 🔪🩸 Code \\

const express = require("express")
require('dotenv').config()
const app = express.Router()
const path = require('path');

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"))
})

// Allow the whole site to use ./static/terminal.css, ./static/avatarAsciiTransparent.png and ./static/terminal.js
// This includes changing the MIME type respectively
app.use("/terminal.css", (req, res) => {res.set("Content-Type", "text/css"); res.sendFile(path.join(__dirname, "/static/terminal.css"));})
app.use("/avatar/transparentAscii", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/avatarAsciiTransparent.png"));})
app.use("/avatar/ascii", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/avatarAscii.png"));})
app.use("/avatar/normal", (req, res) => {res.set("Content-Type", "image/jpg"); res.sendFile(path.join(__dirname, "/static/avatar.jpg"));})
app.use("/terminal.js", (req, res) => {res.set("Content-Type", "text/javascript"); res.sendFile(path.join(__dirname, "/static/terminal.js"));})

// favicon.ico
app.use("/favicon.ico", (req, res) => {res.set("Content-Type", "image/png"); res.sendFile(path.join(__dirname, "/static/avatarAsciiTransparent.png"));})

// 404 handler
app.use((req, res, next) => {
    // Render the 404 page
    // However, if this is a request to any url with "/error/" in it, then don't redirect to the 404 page
    // And if this is a request to any url with "/bleeding/" in it, then redirect to /bleeding/error/404/
    if (req.url.includes("/error/")) {
        next()
    } else if (req.url.includes("/bleeding/")) {
       res.redirect("/bleeding/error/404/")
    } else {
        // Until I actually finish the redesign, I'm going to redirect to /bleeding/error/404/
        res.redirect("/bleeding/error/404/")
    }
})

// Error handler
app.use((err, req, res, next) => {
    // Render the error page
    res.redirect("/bleeding/error/" + err.status)
})

app.get("/error/:status", (req, res) => {
    res.status(req.params.status)
    res.sendFile(path.join(__dirname, "/error.html"))
})

module.exports = app