// 🔪🩸 Code \\

const express = require("express")
require('dotenv').config()
const app = express.Router()
const path = require('path');

app.use("/static", express.static("static"))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"))
})

module.exports = app