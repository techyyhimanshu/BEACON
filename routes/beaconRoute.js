const { Router } = require('express');
const {addBeacon, login }= require('../controllers/beaconController')
const router = Router();
// Define your routes here

router.post("/api/beacon",addBeacon)
router.post("/api/beacon/login",login)


module.exports = router;
