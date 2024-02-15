const express = require("express");
const app = express();
const {checkStatusCode, GetAllParks, getRideById, postNewRideToPark} = require("./Controllers/gen-controller")

app.use(express.json())


app.get("/api/healthcheck", checkStatusCode)

app.get("/api/parks", GetAllParks)

app.get("/api/ride/:ride_id", getRideById)

app.post('/api/parks/:park_id/rides', postNewRideToPark)


module.exports = app