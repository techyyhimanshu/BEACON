const { Router } = require('express');
const {addBeacon, login, updateBeacon, getAllBeacons, getSingleBeacon, getBeaconsList, beaconVisited }= require('../controllers/beaconController')
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here
router.get("/api/beacons",verifyToken,getAllBeacons)
router.get("/api/beacons/list",getBeaconsList)
router.post("/api/beacon",verifyToken,addBeacon)
router.post("/api/beacon/login",login)
router.patch("/api/beacon/update",verifyToken,updateBeacon)
router.get("/api/beacon/:id",verifyToken,getSingleBeacon)
router.post("/api/beacon/user/visited",beaconVisited)


module.exports = router;
