const db = require('pg-promise')()(process.env.DATABASE_URL);


module.exports = {db}