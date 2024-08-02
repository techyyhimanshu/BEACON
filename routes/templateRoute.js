const { Router } = require('express');
const {createTemplate,   getAllTemplate,getMyTemplate, updateMyTemplate,  deleteMyTemplate }=require("../controllers/templateController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/template",createTemplate)
router.get("/api/templates",getAllTemplate)
router.get("/api/shop/template/:id",getMyTemplate)
router.patch("/api/shop/template/update",updateMyTemplate)
router.post("/api/shop/template/delete",deleteMyTemplate)
module.exports = router;
