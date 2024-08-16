const { Router } = require('express');
const router = Router();
const {beaconFire,templateAsignToBeacon}=require("../controllers/dynamicBeaconController")
// Define your routes here

router.post("/api/beacon/hit",beaconFire)
router.post("/api/beacon/asign",templateAsignToBeacon)




// router.post("/api/category",addCategory)

module.exports = router;