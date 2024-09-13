function markdownToHTML(text) {
    return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='has-text-white'>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>")
    .replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank'>$1</a>")
    .toString("UTF-8");
}
const projects = [
    {
        "title": "Create: Automative",
        "id": "automative",
        "brief": "Automate everything in Minecraft.",
        "description": markdownToHTML([
            "Create: Automative is a project that aims to make *everything* renewable/farmable in Minecraft with the power of Create.",
            "Automative currently adds 4 new items and 10 new recipes, with more planned.",
            "All recipes are balanced around Create, and are designed to be as simple as possible. Alongside, the mod is designed",
            "to be as lightweight as possible, with no new blocks or entities added. All recipes are visible with (J/R)EI, with",
            "EMI support if JEI is installed (akin to base Create).",
            "\n",
            "All current recipes are listed [here](https://github.com/ThePandaParade/CreateAutomative/blob/main/RecipesAndTodo.md)",
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
        "tags": ["Minecraft", "Create", "Automation", "Modding", "Java"],
        "status": "indev",
        "downloadButtonText": "Modrinth Page (Download)"
    },
    {
        "title": "WidgInt",
        "id": "widgint",
        "brief": "Integrate date, time, or Spotify into your social media bio.",
        "description": "WidgInt is a project that aims to make it easier to integrate date, time, or Spotify into your social media bio. WidgInt currently only supports Telegram, with more planned.",
        "link": "https://github.com/ThePandaParade/WidgInt",
        "source": "https://github.com/ThePandaParade/WidgInt",
        "icon": "https://placehold.co/400",
        "license": "MIT",
        "image": "https://placehold.co/1920x1080",
        "tags": ["Automation", "Script", "NodeJS"],
        "status": "paused",
        "downloadButtonText": "GitHub Releases"
    },
    {
        "title": "PixScribe",
        "id": "pixscribe",
        "brief": "A tool to add author information to an image, while keeping the image intact.",
        "description": "PixScribe is a script to add author information and a license to an image, without being intrusive to the image itself. (planned) PixScribe will also allow adding random pixels to obscure the image to prevent AI training.",
        "link": "https://github.com/ThePandaParade/PixScribe",
        "source": "https://github.com/ThePandaParade/PixScribe",
        "icon": "https://placehold.co/400",
        "license": "MIT",
        "image": "https://placehold.co/1920x1080",
        "tags": ["Script", "Image", "NodeJS"],
        "status": "paused",
        "downloadButtonText": "GitHub Releases"
    },
    {
        "title": "Codename: ProjektInmutatio",
        "id": "to-be-named",
        "brief": "A website that aims to allow developers to easily upload and share their mods for any game.",
        "description": "No description available. We are currently looking for contributors to help with this project.",
        "link": "https://github.com/ThePandaParade/ProjektInmutatio",
        "source": "https://github.com/ThePandaParade/ProjektInmutatio",
        "icon": "https://placehold.co/400",
        "license": "None (yet)",
        "image": "https://placehold.co/1920x1080",
        "tags": ["Website", "Modding", "TypeScript"],
        "status": "indev",
        "downloadButtonText": "To be released"
    },
/*     {
        "title": "Test EOL",
        "id": "eol",
        "brief": "The quick brown fox jumps over the lazy dog.",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "link": "https://github.com/ThePandaParade/ProjektInmutatio",
        "source": "https://github.com/ThePandaParade/ProjektInmutatio",
        "icon": "https://placehold.co/400",
        "license": "None (yet)",
        "image": "https://placehold.co/1920x1080",
        "tags": ["Website", "Modding", "TypeScript"],
        "status": "eol",
        "downloadButtonText": "To be released"
    },
    {
        "title": "Test Active",
        "id": "active",
        "brief": "The quick brown fox jumps over the lazy dog.",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "link": "https://github.com/ThePandaParade/ProjektInmutatio",
        "source": "https://github.com/ThePandaParade/ProjektInmutatio",
        "icon": "https://placehold.co/400",
        "license": "None (yet)",
        "image": "https://placehold.co/1920x1080",
        "tags": ["Website", "Modding", "TypeScript"],
        "status": "active",
        "downloadButtonText": "To be released"
    }, */
] // TODO: Redis.
module.exports = function (fastify, opts, done) {
    fastify.get('/', async (request, reply) => {
        // Sort projects by status and then by title.
        // With the order being: active, indev, paused, eol
        const sorted = projects.sort((a, b) => {
            const order = ["active", "indev", "paused", "eol"];
            return order.indexOf(a.status) - order.indexOf(b.status) || a.title.localeCompare(b.title);
        });
        return reply.view('project-list.ejs', { projects: sorted });
    });

    fastify.get('/:project', async (request, reply) => {
        const project = projects.find(project => project.id == request.params.project);
        if (project) {
            return reply.view('project.ejs', project);
        } else {
            return reply.status(404);
        }
    });
    done();
}