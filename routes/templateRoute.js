const { Router } = require('express');
const {createTemplate,   getAllTemplate,getMyTemplate, updateMyTemplate, getShopBeacon,  deleteMyTemplate }=require("../controllers/templateController")
const router = Router();
// Define your routes here

router.post("/api/shop/create-template",createTemplate)
router.get("/api/shop/get-all-template",getAllTemplate)
router.post("/api/shop/get-my-template",getMyTemplate)
router.patch("/api/shop/update-template",updateMyTemplate)
router.post("/api/shop/delete-template",deleteMyTemplate)
router.post("/api/shop/get-shop-beacon",getShopBeacon)




module.exports = router;
