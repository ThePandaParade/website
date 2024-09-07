module.exports = function (fastify, opts, done) {
    fastify.get('/steam', async (request, reply) => {
        return reply.redirect("https://steamcommunity.com/id/ThePandaParade");
    });
    fastify.get('/telegram', async (request, reply) => {
        return reply.redirect("https://t.me/robynsspacestation");
    });
    fastify.get('/twitch', async (request, reply) => {
        return reply.redirect("https://twitch.tv/TheWahParade");
    });
    fastify.get('/github', async (request, reply) => {
        return reply.redirect("https://github.com/ThePandaParade");
    });
    done();
}