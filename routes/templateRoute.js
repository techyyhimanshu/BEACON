const { Router } = require('express');
const {createTemplate,   getAllTemplate,getMyTemplate, updateMyTemplate, getShopBeacon,  deleteMyTemplate }=require("../controllers/templateController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
// Define your routes here

router.post("/api/shop/create-template",createTemplate)
router.get("/api/templates",getAllTemplate)
router.get("/api/shop/template/:id",getMyTemplate)
router.patch("/api/shop/template/update",updateMyTemplate)
router.post("/api/shop/template/delete",deleteMyTemplate)
router.get("/api/shop/beacon/:id",getShopBeacon)




module.exports = router;
