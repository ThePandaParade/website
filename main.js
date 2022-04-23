const express = require("express")
const app = express()
const efu = require("express-fileupload")
var crypto = require("crypto")
var filet = require("file-type")
const readChunk = require('read-chunk');
const path = require('path');
const fs = require("fs")
const rawsubdom = Object.keys(require("./domains.json"))


app.use(express.static("images"))
app.use(express.static("static"))
app.use(efu({safeFileNames: true}))

app.get('/', (req, res) => {
    if (req.subdomains[0] || !req.url.startsWith("https://nxybi.me/")) {
        return res.status(418).send()
    }

    res.sendFile(path.join(__dirname, "/web/root.html"))
})

app.get('/devices', (req,res) => {
    res.sendFile(path.join(__dirname, "/web/devices.html"))
})

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
    // const flname = crypto.randomBytes(6).toString("hex")
    // uploadImg.mv(`images/${flname}.${exte}`)
    // res.send(`https://the.yiffing.life/${flname}.${exte}`)
    
    uploadImg.mv(`images/${ogName}.${exte}`)
    res.send(`https://${chosenDomain}/${ogName}.${exte}`)
})

app.listen("6969", () => console.log("Image server running on port 6969"))