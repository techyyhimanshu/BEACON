const { Router } = require('express');
const {trackUser} = require("../controllers/userController")
const router = Router();
// Define your routes here

router.post("/api/track-user",trackUser);


module.exports = router;
