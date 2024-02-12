const { Pool } = require('pg'); 

/**
 * Create your connection to the DB in this file
 * and remember to export it
 */

/*

{
    PGDATABASE: process.env.PGDATABASE 
}

*/

const db = new Pool();

module.exports = db;