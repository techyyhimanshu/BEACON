const { Router } = require('express');
const {trackUser,beaconTodayUser, beaconTotalUser,getAllUsers,viewTime, userHistory,
    orgWeeklyUsers, orgMonthlyUsers,registerUser, registerFCM, countRegisteredUsers, unregisteredUser,
    loginUser} = require("../controllers/userController")
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
router.post("/api/user/login",loginUser);
router.post("/api/fcm/register",registerFCM);
router.post("/api/userViewTime",viewTime);
router.get("/api/user/registered-count",countRegisteredUsers);
router.post("/api/userHistory",userHistory);
router.get("/api/unregisteredUsers",unregisteredUser);









module.exports = router;
