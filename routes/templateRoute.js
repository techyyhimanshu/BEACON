const { Router } = require('express');
const {createTemplate, createChildTemplate,  getAllTemplate,getMyTemplate,
    asignTemplateToBeacon, updateMyTemplate,  deleteMyTemplate }=require("../controllers/templateController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/template",createTemplate)
router.get("/api/templates",getAllTemplate)
router.get("/api/template/:id",getMyTemplate)
router.patch("/api/template/update",updateMyTemplate)
router.post("/api/template/delete",deleteMyTemplate)
router.post("/api/template/asign",asignTemplateToBeacon)
router.post("/api/template/crateChild",createChildTemplate)


module.exports = router;
