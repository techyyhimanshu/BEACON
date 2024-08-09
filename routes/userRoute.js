const { Router } = require('express');
const {trackUser,beaconTodayUser,beaconWeekUser, beaconTotalUser} = require("../controllers/userController")
const router = Router();
// Define your routes here

router.post("/api/track-user",trackUser);
router.post("/api/track-beacon-total-user",beaconTotalUser);



module.exports = router;
