const db = require("../../db/connection")
const format = require("pg-format")

function SelectAllParks() {
  return  db.query("SELECT * FROM parks")
}
function selectRideById(ride_id) {
    const queryString = format(`SELECT * FROM rides
    WHERE ride_id = %L`, [ride_id])
    return db.query(queryString)
}
function addNewRide(passedData) {
    const park_id = passedData.UrlNum;
    const ride_name = passedData.data.ride_name;
    const year_opened = passedData.data.year_opened;
    const votes = 0

    const queryString = format(`INSERT INTO rides (park_id, ride_name, year_opened, votes)
    VALUES %L;`, [park_id, ride_name, year_opened, votes])
    console.log(queryString);
    return db.query(queryString)
}


module.exports = {SelectAllParks, selectRideById, addNewRide}