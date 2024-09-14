const { Router } = require('express');
const router = Router();
const { getAllTask,
        getSingleTask,
        updateTask,
        getPersonTask,
        deleteTask,
        asignTask,
        taskReport}=require("../controllers/dailyTaskController")
// Define your routes here

router.get("/api/dailyTask",getAllTask)
router.get("/api/Task/:id?",getSingleTask)
router.get("/api/personnel/task/:id?",getPersonTask)
router.post("/api/asignTask",asignTask)
router.post("/api/reportTask",taskReport)
router.put("/api/Task/:id?",updateTask)
router.delete("/api/Task/:id?",deleteTask)

module.exports = router;
