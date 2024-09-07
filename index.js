const fastify = require('fastify');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Initialize the server
const server = fastify();

if (process.env.REDIS_ENABLED == "true") {
  const { createClient } = require('redis');
  // Initalize the Redis client
  const redis = createClient(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_URL}:${process.env.REDIS_PORT}`);
  // 🌠jank🌠
  redis.on('error', (err) => console.log('Redis error: ' + err));
}

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

// Add a register for sites that need to be served under ejs (projects/blog)
server.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs')
  },
  root: path.join(__dirname, "web", "octashibe", "templates"),
  production: process.env.PRODUCTION
});

// ** Define routes ** \\
// Because we're on L39 and we have yet to do anything proper.

// Import the links redirect
server.register(require('./routers/links.js'), { prefix: '/links' });
server.register(require('./routers/links.js'), { prefix: '/l' });

// Import the Octashibe Redesign router
server.register(require('./routers/octashibe'), { prefix: '/octashibe' });
server.register(require('./routers/octashibe'), { prefix: '/os' });

// Import the blog router
server.register(require('./routers/blog'), { prefix: '/blog' });
server.register(require('./routers/blog'), { prefix: '/b' });

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

// Route for about.html
server.get('/about', async (request, reply) => {
    return reply.sendFile('about.html');
});

// Route for dms.html
server.get('/dms', async (request, reply) => {
    return reply.sendFile('dms.html');
});

// Robots.txt
server.get('/robots.txt', async (request, reply) => {
    return reply.sendFile('robots.txt');
});

// Start the server
const start = async () => {
  try {
    if (!process.env.PORT) {
      console.warn('No PORT environment variable found. Defaulting to 5000.');
    }
    if (process.env.REDIS_ENABLED == "true") {
      console.log('Redis enabled. Using ' + process.env.REDIS_URL);
      server.decorate('redis', redis);
    } else {
      console.log('Redis disabled. Set REDIS_ENABLED to true to enable.');
      console.warn('Blog and project pages will not work or init.')
    }
    await server.listen({port: process.env.PORT || 5000});
    console.log(`Server is running on ${server.server.address().port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();