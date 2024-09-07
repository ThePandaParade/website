// Octashibe: 2024 Redesign
// Because I hate myself, I'm going to make this look like a proper website.
//
// Robyn-Dawn 06-09-2024
function markdownToHTML(text) {
    return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='has-text-white'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2'>$1</a>")
    .toString("UTF-8");
}
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
                "description": markdownToHTML([
                    "Create: Automative is a project that aims to make *everything* renewable/farmable in Minecraft with the power of Create.",
                    "Automative currently adds 4 new items and 10 new recipes, with more planned.",
                    "All recipes are balanced around Create, and are designed to be as simple as possible. Alongside, the mod is designed",
                    "to be as lightweight as possible, with no new blocks or entities added. All recipes are visible with (J/R)EI, with",
                    "EMI support if JEI is installed (akin to base Create).",
                    "\n",
                    "As listing *every* recipe would be a bit much, here's recipes for the new items:",
                    "\n - **Blank Mould**: (Smoke) 1x Clayball",
                    "\n - **Star Mould**: (Deploy) 1x Nether Star on 1x Blank Mould",
                    "\n - **Gem Mould**: (Deploy) 1x Nether Ingot on 1x Blank Mould",
                    "\n - (more added in future updates)",
                    "\n\n",
                    "The mod uses Architechtury for its API, and supports:",
                    "\n - NeoForge 1.20.1",
                    "\n - Fabric 1.20.1",
                    "\n\n",
                    "Requires Create v0.3.2c+ and Architectury v9.1.12+",
                    "\n",
                    "**Modpack Developers**: You are free to include this mod in your pack, as long as you do not claim the mod as your own.",
                    "\n**NOTE**: This may inbalance server economies if the currency is a vanilla item. Please be aware of this when adding to a server.",
                    "\n**NOTE**: At the current time, we do not have support for other mods. This is low-priority planned feature, and may be released in",
                    "a future update.",
                ].join(" ")),
                "link": "https://modrinth.com/project/createautomative",
                "source": "https://github.com/ThePandaParade/CreateAutomative",
                "icon": "/public/static/projects/CreateAutomative-icon.png",
                "license": "LGPL-2.1",
                "image": "/public/static/projects/CreateAutomative-image.png",
                "tags": ["Minecraft Mod", "Create", "Automation", "Java"],
                "status": "indev",
                "downloadButtonText": "Modrinth Page (Download)"
            }
        );
    });
    fastify.get('/projects/automative', async (request, reply) => {
        return reply.redirect('/projects/create_automative');
    });

    fastify.get('/maintenance', async (request, reply) => {
        return reply.sendFile('octashibe/maintenance.html');
    });
    fastify.get('/', async (request, reply) => {
        return { hello: 'world', "dir": __dirname, "path": path_root};
    });
    // Brand spankin new error page and functionality
    fastify.setErrorHandler(async (error, request, reply) => {
        //console.log(error);
        reply.status(error.errorCode || 500);
        let statusCodeText = ""
        switch(reply.statusCode) {
            case 500:
                statusCodeText = "Internal Server Error";
                break;
            case 403:
                statusCodeText = "Forbidden";
                break;
            case 400:
                statusCodeText = "Bad Request";
                break;
            case 401:
                statusCodeText = "Unauthorized";
                break;
            case 405:
                statusCodeText = "Method Not Allowed";
                break;
            case 406:
                statusCodeText = "Not Acceptable";
                break;
            case 409:
                statusCodeText = "Conflict";
                break;
            case 418:
                statusCodeText = "bri'ish";
                break;
            case 420:
                statusCodeText = "get a life.";
                break;
            default:
                statusCodeText = "Unknown Error - start panicking.";
                break;
        }
        return reply.view('error.ejs', { "error": error.stack, "statusCode":  reply.statusCode, "statusCodeText": statusCodeText });
    });
    fastify.setNotFoundHandler(async (request, reply) => {
        reply.status(404);
        return reply.view('404.ejs', {page: request.url});
    });
    done();
}