const { Router } = require('express');
const {addBeacon, updateBeacon, getAllBeacons, getSingleBeacon,deleteBeacon, getBeaconsList }= require('../controllers/beaconController')
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here
router.get("/api/beacons",getAllBeacons)
router.get("/api/beacons/list",getBeaconsList)
router.post("/api/beacon",verifyToken,addBeacon)
// router.post("/api/beacon/login",login)
router.patch("/api/beacon/update",verifyToken,updateBeacon)
router.get("/api/beacon/:id",verifyToken,getSingleBeacon)
router.delete("/api/beacon/:id",deleteBeacon)

module.exports = router;
