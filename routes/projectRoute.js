const { Router } = require('express');
const {createProject, getProjectList, getProjectTasks}=require('../controllers/projectController')
const router = Router();

router.post("/api/project",createProject)
router.get("/api/project/list",getProjectList)
router.get("/api/project/:id?/tasks",getProjectTasks)

module.exports=router