const express = require("express")
require('dotenv').config()
const app = express()
const efu = require("express-fileupload")
var filet = require("file-type")
const path = require('path');
const rawsubdom = Object.keys(require("./domains.json"))

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

app.get("/links/onlyfans", (req, res) => {
    res.send(`<script> window.location.replace("https://www.youtube.com/watch?v=xm3YgoEiEDc") </script>`)
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

app.listen(process.env.PORTFOLIO, () => console.log(`Listening to port ${process.env.PORTFOLIO}`))