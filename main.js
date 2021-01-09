const express = require("express")
const app = express()
const efu = require("express-fileupload")
var crypto = require("crypto")
var filet = require("file-type")
const readChunk = require('read-chunk');
const path = require('path');
const fs = require("fs")
const rawsubdom = require("./domains.json")


app.use(express.static("images"))
app.use(express.static("static"))
app.use(efu({safeFileNames: true}))

app.get('/', (req, res) => {
    if (req.subdomains[0] == "images") {
        return res.status(418).send("418: You're a teapot.<br><a href=\"https://nxybi.me/\">You're looking for here</a>")
    }
    if (req.hostname == "yiffing.life") {
        return res.redirect("https://nxybi.me/")
    }
    res.sendFile(path.join(__dirname, "/web/root.html"))
})

app.post('/upload', (req, res) => {
    if (req.headers.authorization !== "48f200B1eA732c8EaEc729C34189e7F76cBe9F2840dCcEdEcA") {
        return res.status(401).send({'error': true, 'code': 401})
    }
    
    if (!req.files) {
        return res.status(400).send({'error': true, 'code': 400})
    }

    let uploadImg = req.files.upImg
    let ogName = uploadImg.name
    const buffer = uploadImg.data.slice(0, filet.minimumBytes); 

    let exte = (await filet.fromBuffer(buffer)).ext

    const flname = crypto.randomBytes(6).toString("hex")
    uploadImg.mv(`images/${flname}.${exte}`)
    res.send(`https://the.yiffing.life/${flname}.${exte}`)
})

app.listen("6969", () => console.log("Image server running on port 6969"))