const db = require("./connection");
const format = require("pg-format");
// const { parks, rides, stalls } = require("./data/index.js");

function seed({ parks, rides, stalls, foods}) {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods CASCADE;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods CASCADE;");
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
      const queryString = format(
        `INSERT INTO parks (park_name, year_opened, annual_attendance) VALUES %L RETURNING *`,
        formattedData
      );
      return db.query(queryString);
    })
    .then((result) => {
      const dict = {};
      result.rows.forEach((row) => {
        dict[row.park_name] = row.park_id;
      });

      const formattedRides = rides.map((ride) => {
        return [
          ride.ride_name,
          ride.year_opened,
          dict[ride.park_name],
          ride.votes,
        ];
      });
      const queryRidesString = format(
        `INSERT INTO rides (ride_name, year_opened, park_id, votes) VALUES %L`,
        formattedRides
      );
      return db.query(queryRidesString);
    })
    .then(() => {
      return createFoods()
    })
    .then(() => {
      return createStalls()
    })
    .then(() => {
      return createStallsFood()
    })
    .then(() => {
      const formattedFoods = foods.map((food) => {
        return [food.food_name, food.vegan_option]
      })
      const foodsQStr = format(`INSERT INTO foods (food_name, is_vegan) VALUES %L`, formattedFoods)
      return db.query(foodsQStr)
    })
    .catch((err) => {
      console.log("There is an error!");
      console.log(err);
    });
}

function createParks() {
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

function createFoods() {
  return db.query(`CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR(225),
    is_vegan BOOLEAN NOT NULL);`);
}

function createStalls() {
  return db.query(`CREATE TABLE stalls (
    stall_id SERIAL PRIMARY KEY,
    stall_name VARCHAR(225),
    park_name VARCHAR(225));`);
}

function createStallsFood() {
  return db.query(`CREATE TABLE stalls_foods (
    stalls_food_id SERIAL PRIMARY KEY,
    food_id INT REFERENCES foods(food_id),
    stalls_id INT REFERENCES stalls(stall_id)
  );`)
}

module.exports = seed;
