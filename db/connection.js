const { Pool } = require('pg'); 

//need to set the database and have a if statement to say an error if not avaliable

const db = new Pool();

module.exports = db;