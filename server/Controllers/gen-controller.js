const { SelectAllParks, selectRideById, addNewRide } = require("../Models/genModels")



function checkStatusCode(req, res) {
    res.status(200).send()
}
function GetAllParks(req, res) {
    return SelectAllParks().then((response) => {
        const data = response.rows
        res.status(200).send({parks: data})
    })
}
function getRideById(req, res) {
    const {ride_id} = req.params
    selectRideById(ride_id).then((response) => {
        const result = response.rows
        res.status(200).send({ride: result})
    })
}
function postNewRideToPark(req, res){
    const data = req.body
    const regex = /(?<=\/parks\/)(\d+)(?=\/rides)/g
    const UrlNum = Number(req.url.match(regex))
    const passData = {data, UrlNum}
    addNewRide(passData).then((response) => {
        console.log(response);
    })
    
}


module.exports = {checkStatusCode, GetAllParks, getRideById, postNewRideToPark }