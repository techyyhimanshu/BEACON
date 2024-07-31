const { Router } = require('express');
const {createTemplate,   getAllTemplate,  updateMyTemplate, getShopBeacon,  deleteMyTemplate}=require("../controllers/templateController")
const router = Router();
// Define your routes here

router.post("/api/shop/create-template",createTemplate)
router.get("/api/shop/get-all-template",getAllTemplate)
router.get("/api/shop/update-template",updateMyTemplate)
router.patch("/api/shop/delete-template",deleteMyTemplate)
router.post("/api/shop/get-shop-beacon",getShopBeacon)




module.exports = router;
