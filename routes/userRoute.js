const { Router } = require('express');
const {trackUser,beaconTodayUser,beaconWeeklUsers, beaconTotalUser,getAllUsers, beaconMonthlyUsers} = require("../controllers/userController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/track-user",trackUser);
router.get("/api/track-beacon-total-users",beaconTotalUser);
router.post("/api/track-beacon-today-users",beaconTodayUser);
router.post("/api/track-beacon-weekly-users",beaconWeeklUsers);
router.post("/api/track-organization-monthly-users",beaconMonthlyUsers);
router.get("/api/get-all-user",verifyToken,getAllUsers);






module.exports = router;
