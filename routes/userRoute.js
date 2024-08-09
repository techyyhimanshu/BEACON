const { Router } = require('express');
const {trackUser,beaconTodayUser,beaconWeekUser, beaconTotalUser,getAllUsers} = require("../controllers/userController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/track-user",trackUser);
router.post("/api/track-beacon-total-user",beaconTotalUser);
router.post("/api/track-beacon-today-user",beaconTodayUser);
router.post("/api/track-beacon-week-user",beaconWeekUser);
router.get("/api/get-all-user",verifyToken,getAllUsers);






module.exports = router;
