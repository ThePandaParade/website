// Octashibe: 2024 Redesign
// Because I hate myself, I'm going to make this look like a proper website.
//
// Robyn-Dawn 06-09-2024

module.exports = function (fastify, opts, done) {
    fastify.get('/', async (request, reply) => {
        return reply.sendFile('octashibe/brief.html');
    });

    fastify.get('/about', async (request, reply) => {
        return reply.sendFile('octashibe/about.html');
    });

    fastify.get('/maintenance', async (request, reply) => {
        return reply.sendFile('octashibe/maintenance.html');
    });

    // Brand spankin new error page and functionality
    fastify.setErrorHandler(async (error, request, reply) => {
        //console.log(error);
        reply.status(error.errorCode || 500);
        let statusCodeText = ""
        switch(reply.statusCode) {
            case 500: statusCodeText = "Internal Server Error"; break;
            case 403: statusCodeText = "Forbidden"; break;
            case 400: statusCodeText = "Bad Request"; break;
            case 401: statusCodeText = "Unauthorized"; break;
            case 405: statusCodeText = "Method Not Allowed"; break;
            case 406: statusCodeText = "Not Acceptable"; break;
            case 409: statusCodeText = "Conflict"; break;
            case 418: statusCodeText = "bri'ish"; break;
            case 420: statusCodeText = "get a life."; break;
            default: statusCodeText = "Unknown Error - start panicking."; break;
        }
        return reply.view('error.ejs', { "error": error.stack, "statusCode":  reply.statusCode, "statusCodeText": statusCodeText });
    });
    fastify.setNotFoundHandler(async (request, reply) => {
        reply.status(404);
        return reply.view('404.ejs', {page: request.url});
    });
    done();
}