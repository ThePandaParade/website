const fastify = require('fastify');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize the server
const server = fastify();

// Import @fastify/static for the sendFile function
server.register(require('@fastify/static'), {
  root: path.join(__dirname, "web"),
  serve: false
});

// Also to serve /public/ 
server.register(require('@fastify/static'), {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
  decorateReply: false
});

// ...and /web/blog/
server.register(require('@fastify/static'), {
  root: path.join(__dirname, "web", "blog"),
  prefix: "/blog/",
  decorateReply: false
});

// ** Define routes ** \\
// Because we're on L32 and we have yet to do anything proper.

// Route for serving index.html
server.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// Route for serving mostly the /info embed, which redirects to root if the user is not a bot
server.get('/info', async (request, reply) => {
    if (request.headers['user-agent'].includes('Discordbot')) {
        return reply.sendFile('info.html');
    } else {
        return reply.redirect('/');
    }

});

// Route for maintenance.html
server.get('/maintenance', async (request, reply) => {
    return reply.sendFile('maintenance.html');
});

// Route for about.html
server.get('/about', async (request, reply) => {
    return reply.sendFile('about.html');
});

// On an error, redirect to the error page
server.setErrorHandler(async (error, request, reply) => {
    return reply.redirect('/error/' + error.statusCode);
});

server.setNotFoundHandler(async (request, reply) => {
    return reply.redirect('/error/404');
});

server.get('/error/:code', async (request, reply) => {
    return reply.sendFile('error.html');
})


// Last things last: define all .well-known routes

// Synapse
server.get('/.well-known/matrix/server', async (request, reply) => {
    return {"m.server": "matrix.pandapa.ws:443"};
});

// Mastodon, TODO: fix this bullshit
/* server.get(['/.well-known/webfinger*', '/.well-known/host-meta*', '/.well-known/nodeinfo*'], async (request, reply) => {
    return reply.redirect('https://mastodon.pandapa.ws' + request.raw.url);
}); */

// Robots.txt
server.get('/robots.txt', async (request, reply) => {
    return reply.sendFile('robots.txt');
});

// Start the server
const start = async () => {
  try {
    await server.listen({port: process.env.PORT || 3000});
    console.log(`Server is running on ${server.server.address().port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();