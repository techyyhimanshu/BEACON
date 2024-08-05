const { Router } = require('express');
const {addBeacon, login, updateBeacon, getSingleBeacon }= require('../controllers/beaconController')
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here

router.post("/api/beacon",verifyToken,addBeacon)
router.post("/api/beacon/login",login)
router.patch("/api/beacon/update",verifyToken,updateBeacon)
router.get("/api/beacon/:id",verifyToken,getSingleBeacon)


module.exports = router;
