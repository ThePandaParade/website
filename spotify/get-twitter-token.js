// Gets token from Twitter and prints it - starting a mini webserver to authenticate it.
require('dotenv').config()
const { TwitterApi } = require('twitter-api-v2')
const fastify = require('fastify')()
const fs = require('fs')
const TwitterFullUrl = `${process.env.TWITTER_REDIRECT_URI}${process.env.TWITTER_REDIRECT_ROUTE}`

const client = new TwitterApi({clientId: process.env.TWITTER_CLIENT_ID, clientSecret: process.env.TWITTER_CLIENT_SECRET, redirectUri: TwitterFullUrl})
const { url, codeVerifier, state } = client.generateOAuth2AuthLink(`${process.env.TWITTER_REDIRECT_URI}${process.env.TWITTER_REDIRECT_ROUTE}`, { scope: ["tweet.write", "offline.access"] });


fastify.get("/" + process.env.TWITTER_REDIRECT_ROUTE, async (request, reply) => {
    console.log("Received request to authorize.")
    const { code, state } = request.query;
    console.log(`Received code: ${code}`)
    console.log(`Received state: ${state}`)

    client.v2.loginWithOAuth2({ code, codeVerifier, TwitterFullUrl })
        .then(async ({ client: loggedClient, accessToken, refreshToken, expiresIn}) => {
            console.log("Successfully logged in.")
            console.log("Access Token: " + accessToken)
            console.log("Refresh Token: " + refreshToken)
            console.log("Expires in: " + expiresIn)
            console.log("Saving tokens to file.")
            let parsedString = JSON.stringify({ access: accessToken, refresh: refreshToken, expires: expiresIn })
            fs.writeFileSync("./spotify/TWITTER_TOKEN", parsedString)
            
            console.log("Done.")
            await reply.send("Done.")
            process.exit(0)
        })
})

// Starts the server
const start = async () => {
    try {
        console.log("Please authorize.")
        console.log(url)
        await fastify.listen({ port: process.env.TWITTER_REDIRECT })
    } catch (err) {
      console.error(err)
      process.exit(1)
    }
  }
start()