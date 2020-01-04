const express = require("express")
const app = express()
const efu = require("express-fileupload")
var crypto = require("crypto")
var filet = require("file-type")
const readChunk = require('read-chunk');

app.use(express.static("images"))
app.use(efu({safeFileNames: true}))

app.get('/', (req, res) => {
    res.send("Yiff is hot")
})

app.post('/upload', (req, res) => {
    if (req.headers.authorization !== "CDyrnblrmxwk2TTkOOVRC8cSsGKAJFxp66uHYi9SEj4wS9M2zD") {
        return res.status(401).send({'error': true, 'code': 401})
    }
    
    if (!req.files) {
        return res.status(400).send({'error': true, 'code': 400})
    }

    let uploadImg = req.files.upImg
    let ogName = uploadImg.name
    const buffer = uploadImg.data.slice(0, filet.minimumBytes); 

    let exte = filet(buffer).ext

    const flname = crypto.randomBytes(6).toString("hex")
    uploadImg.mv(`images/${flname}.${exte}`)
    res.send(`https://{req.hostname}/${flname}.${exte}`)
})

app.listen("6969", () => console.log("Image server running on port 6969"))
