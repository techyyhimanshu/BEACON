const { Router } = require('express');
const router = Router();
const {beaconFire,templateAsignToBeacon,LinkAsignToBeacon, createConnectionLogs, getConnectionLogs}=require("../controllers/dynamicBeaconController")
// Define your routes here

router.post("/api/beacon/hit",beaconFire)
router.post("/api/beacon/asign",templateAsignToBeacon)
router.post("/api/beacon/asignLink",LinkAsignToBeacon)
router.post("/api/beacon/create-log",createConnectionLogs)
router.post("/api/beacon/get-log",getConnectionLogs)






// router.post("/api/category",addCategory)

module.exports = router;