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

// ...and /web/projects - one day I will make this look better, I promise
/* server.register(require('@fastify/static'), {
  root: path.join(__dirname, "web", "projects"),
  prefix: "/projects/",
  decorateReply: false
}); */

// Add a register for sites that need to be served under ejs (projects/blog)
server.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, "web", "octashibe", "templates"),
});

// ** Define routes ** \\
// Because we're on L39 and we have yet to do anything proper.

// Import the links redirect
server.register(require('./routers/links.js'), { prefix: '/links' });
server.register(require('./routers/links.js'), { prefix: '/l' });

// Import the Octashibe Redesign router
server.register(require('./routers/octashibe'), { prefix: '/octashibe' });
server.register(require('./routers/octashibe'), { prefix: '/os' });

// Add middleware to block ByteSpider
server.addHook('preHandler', async (request, reply) => {
  if (request.headers['user-agent'].includes('ByteSpider')) {
      return reply.status(403).send('Forbidden.');
  }
}
);

// Route for serving index.html
server.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// Route for serving mostly the /info embed, which redirects to root if the user is not a bot
server.get('/info', async (request, reply) => {
    if (request.headers['user-agent'].toLowerCase().includes('bot')) {
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

// Route for dms.html
server.get('/dms', async (request, reply) => {
    return reply.sendFile('dms.html');
});

// On an error, redirect to the error page
/* server.setErrorHandler(async (error, request, reply) => {
    return reply.redirect('/error/' + error.statusCode);
});

server.setNotFoundHandler(async (request, reply) => {
    return reply.redirect('/error/404');
});
server.get('/error/:code', async (request, reply) => {
    return reply.sendFile('error.html');
}) */

// Robots.txt
server.get('/robots.txt', async (request, reply) => {
    return reply.sendFile('robots.txt');
});

// Start the server
const start = async () => {
  try {
    await server.listen({port: process.env.PORT || 5000});
    console.log(`Server is running on ${server.server.address().port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();