const { Router } = require('express');
const {trackUser,beaconTodayUser, beaconTotalUser,getAllUsers,viewTime, orgWeeklyUsers, orgMonthlyUsers,registerUser, registerFCM} = require("../controllers/userController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/track-user",trackUser);
router.get("/api/track-beacon-total-users",beaconTotalUser);
router.post("/api/track-beacon-today-users",beaconTodayUser);
router.post("/api/track-organization-weekly-users",orgWeeklyUsers);
router.post("/api/track-organization-monthly-users",orgMonthlyUsers);
router.get("/api/get-all-user",verifyToken,getAllUsers);
router.post("/api/user/register",registerUser);
router.post("/api/fcm/register",registerFCM);
router.post("/api/userViewTime",viewTime);








module.exports = router;
