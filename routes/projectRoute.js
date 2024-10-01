const { Router } = require('express');
const {createProject, getProjectList}=require('../controllers/projectController')
const router = Router();

router.post("/api/project",createProject)
router.get("/api/project/list",getProjectList)

module.exports=router