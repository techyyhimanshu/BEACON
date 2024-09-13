const { Router } = require('express');
const router = Router();
const {getAllTask , asignTask }=require("../controllers/dailyTaskController")
// Define your routes here

router.get("/api/dailyTask",getAllTask)
router.post("/api/asignTask",asignTask)

module.exports = router;
