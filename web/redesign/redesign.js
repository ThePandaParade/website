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

module.exports = app