// Gets token from Spotify and prints it - starting a mini webserver to authenticate it.
require('dotenv').config()
const SpotifyWebApi = require('spotify-web-api-node');
const fastify = require('fastify')()
const fs = require('fs')

const SpotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI + process.env.SPOTIFY_REDIRECT_ROUTE
})


fastify.get("/" + process.env.SPOTIFY_REDIRECT_ROUTE, async (request, reply) => {
    console.log("Received request to authorize.")
    SpotifyApi.authorizationCodeGrant(request.query.code).then(async (data) => {
        let accesstoken = data.body["access_token"]
        let refreshtoken = data.body["refresh_token"]

        if (accesstoken == (undefined||"")) { // Check if accesstoken returned, as refreshtoken would be valid
            console.log("No token recieved.")
            process.exit(1)
        }
        console.log(accesstoken,refreshtoken)
        console.log("Token authorized.")
        console.log("Writing to file...")
        await fs.writeFileSync("./spotify/ACCESS_TOKEN", accesstoken)
        await fs.writeFileSync("./spotify/REFRESH_TOKEN", refreshtoken)
        await reply.send("Token written to file.")
        console.log("Token written to file.")
        process.exit(1)
    })
})

// Starts the server
const start = async () => {
    try {
        console.log("Please authorize.")
        console.log(SpotifyApi.createAuthorizeURL(["user-read-currently-playing"]))
        await fastify.listen({ port: process.env.SPOTIFY_REDIRECT })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
start()