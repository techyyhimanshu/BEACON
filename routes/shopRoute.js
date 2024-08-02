const { Router } = require('express');
const {createShop,getAllShops,getSingleShop,updateShop,deleteShop,shopLogin,getShopBeacon}=require("../controllers/shopController");
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here

router.post("/api/shop",verifyToken,createShop)
router.get("/api/shops",verifyToken,getAllShops)
router.post("/api/shop/login",shopLogin)


router.get("/api/shop/:id",verifyToken,getSingleShop)
router.patch("/api/shop/:id",verifyToken,updateShop)
router.delete("/api/shop/:id",verifyToken,deleteShop)
router.get("/api/shop/:id/beacons",getShopBeacon)

module.exports = router;
