const pages = {
    "2024-01-11": {
        "friendly": "The Exodus",
        "summary": "My transition to Linux and away from the Microsoft ecosystem.",
        "author": "Robyn",
        "date": "2024-01-11",
        "long": "exodus.txt",
        "tags": ["linux", "microsoft", "exodus"]
    },
    "2024-02-29": {
        "friendly": "The Exodus: One Month Later",
        "summary": "A reflection on my first month using Linux.",
        "author": "Robyn",
        "date": "2024-02-29",
        "long": "one_month_on.txt",
        "tags": ["linux", "microsoft", "exodus"]
    },
    "2024-09-07": {
        "friendly": "Discord Should Not Be A Market Leader",
        "summary": "A rant post on how Discord should not be leading in the chat space.",
        "author": "Robyn",
        "date": "2024-09-07",
        "long": "discord_gfy.txt",
        "tags": ["discord", "rant"]
    }
} // TODO: Finalise this using Redis.
const fs = require('fs');
const path = require('path');
module.exports = function (fastify, opts, done) {
    fastify.get('/', async (request, reply) => {
        // Calculate read time of each post
        Object.values(pages).forEach(post => {
            let long = ""
            try {
                long = fs.readFileSync(path.join(__dirname + "/../blog/" + post.long), 'utf8');
            }
            catch (e) {
                long = "The quick brown fox jumped over the lazy dog.";
            }
            post.readTime = Math.ceil(long.split(' ').length / 200);
            post.pluralNoun = post.readTime == 1 ? "minute" : "minutes";
        });
        return reply.view('blog-list.ejs', { posts: Object.values(pages).reverse() });
    });
    fastify.get('/new', async (request, reply) => {
        return reply.redirect("/maintenance"); // TODO: Authentication and this page.
    });
    fastify.get('/:page', async (request, reply) => {
        // Check if the page exists
        const page = Object.values(pages).find(post => post.date == request.params.page);
        if (page) {
            const long = fs.readFileSync(path.join(__dirname + "/../blog/" + page.long), 'utf8');
            return reply.view('blog.ejs', { post: page, long: long });
        } else {
            return reply.status(404)
        }
    });
    done();
}