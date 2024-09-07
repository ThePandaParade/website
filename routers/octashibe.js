// Octashibe: 2024 Redesign
// Because I hate myself, I'm going to make this look like a proper website.
//
// Robyn-Dawn 06-09-2024
module.exports = function (fastify, opts, done) {
    fastify.get('/brief', async (request, reply) => {
        return reply.sendFile('octashibe/brief.html');
    });
    fastify.get('/about', async (request, reply) => {
        return reply.sendFile('octashibe/about.html');
    });
    fastify.get('/projects/create_automative', async (request, reply) => {
        return reply.view('project.ejs', 
            {
                "title": "Create: Automative",
                "brief": "Automate everything in Minecraft.",
                "description": "Create: Automative is a project that aims to make **everything** renewable/farmable in Minecraft with Create.",
            }
        );
    });
    fastify.get('/', async (request, reply) => {
        return { hello: 'world', "dir": __dirname, "path": path_root};
    });
    done();
}