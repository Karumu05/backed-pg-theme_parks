const db = require("./connection");
const format = require("pg-format");
// const { parks, rides, stalls } = require("./data/index.js");

function seed({ parks, rides, stalls }) {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
      const formattedData = parks.map((park) => {
        return [park.park_name, park.year_opened, park.annual_attendance];
      });
      const queryString = format(`INSERT INTO parks (park_name, year_opened, annual_attendance) VALUES %L RETURNING *`, formattedData);
      return db.query(queryString);
    })
    .then((result) => {
      
      console.log(result.rows);
      
      // ALTER TABLE table_name 
      // DROP COLUMN column_name;

      const dict = {};
      result.rows.forEach((row) => {
        dict[row.park_name] = row.park_id;
      });

      rides.map((ride) => {
        const thisRide = { ...ride, 'park_id': dict[ride['park_name']] };
        delete thisRide.park_name;
        return thisRide;
      });

      db.query(`ALTER TABLE rides
      ADD park_id INT REFERENCES park(park_id) ON DELETE CASCADE;`);

      

    })
    .catch((err) => {
      console.log("There is an error!");
      console.log(err);
    });
}

function createParks() {
  /* Create your parks table in the query below */
  return db.query(`CREATE TABLE parks (
                    park_id SERIAL PRIMARY KEY,
                    park_name VARCHAR(255) NOT NULL,
                    year_opened INT NOT NULL,
                    annual_attendance INT NOT NULL );`);
}

function createRides() {
  return db.query(`CREATE TABLE rides (
    ride_id SERIAL PRIMARY KEY,
    park_id INT REFERENCES parks(park_id) ON DELETE CASCADE,
    ride_name VARCHAR(255) NOT NULL,
    year_opened INT NOT NULL,
    votes INT DEFAULT 0);`);
}

module.exports = seed;
