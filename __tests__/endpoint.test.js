const request = require("supertest");
const app = require("../server/theme_parks_app");
const seed = require("../db/seed");
const data = require("../db/data/index")
const db = require("../db/connection")

beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    db.end()
})

describe('GET /api/healthcheck', () => {
    test('should respond with a status code of 200', () => {
        return request(app)
        .get("/api/healthcheck")
        .expect(200)
    });
});

describe('GET /api/parks', () => {
   test('should respond with a status code of 200', () => {
        return request(app)
        .get("/api/parks")
        .expect(200)
   }); 
   test('should respond with an array of parks objects with the properties park_id, park_name and year opened', () => {
        return request(app)
        .get("/api/parks")
        .expect(200)
        .then((response) => {
            const body = response.body;
            expect(body.parks.length).toBe(4)
            body.parks.forEach((park) => {
                expect(typeof park["park_id"]).toBe("number")
                expect(typeof park["park_name"]).toBe("string")
                expect(typeof park["year_opened"]).toBe("number")
            })
            expect(Object.keys(body.parks[0]).sort()).toEqual(["park_id", "park_name", "year_opened", "annual_attendance"].sort())

        })
   });
});

describe('GET /api/ride/:ride_id', () => {
    test('should respond with a status code of 200', () => {
        return request(app)
        .get("/api/ride/1")
        .expect(200)
    });
    test('should respond with an object with the correct properties', () => {
        return request(app)
        .get("/api/ride/1")
        .expect(200)
        .then((response) => {
            const ride =response.body.ride
            ride.forEach((ride) => {
                expect(typeof ride["ride_id"]).toBe("number")
                expect(ride["ride_id"]).toBe(1)
                expect(ride["ride_name"]).toBe("Colossus")
                expect(ride["votes"]).toBe(5)
            })
        })
    });
});

describe.only('POST /api/parks/:park_id/rides', () => {
    test('should respond with a status code of 201', () => {
        return request(app)
        .post("/api/parks/:park_id/rides")
        .expect(201)
    });
    test('should respond with the newly posted ride object', () => {
        const body = {
            ride_name: "new ride",
            year_opened: 2024,
        }
        return request(app)
        .post("/api/parks/:park_id/rides")
        .send(body)
        .expect(201)
        .then((response) => {
            const ride =response.body.ride
            ride.forEach((ride) => {
                expect(typeof ride["ride_id"]).toBe("number")
                expect(ride["ride_id"]).toBe(21)
                expect(ride["ride_name"]).toBe("new ride")
                expect(ride["votes"]).toBe(0)
            })
        })
    });
});


