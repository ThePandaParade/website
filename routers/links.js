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
    fastify.get('/contribute', async (request, reply) => {
        return reply.redirect("https://github.com/ThePandaParade/website");
    });
    fastify.get('/discord', async (request, reply) => {
        return reply.redirect("/public/static/you_serious.mp4");
    });
    done();
}