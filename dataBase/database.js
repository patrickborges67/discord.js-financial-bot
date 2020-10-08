const pg = require('pg');

const client = new pg.Client({
    user: "postgress",
    host: "localhost",
    database: "postgres",
    oassword: "postgres",
    port: 5432,
})

module.exports = client;