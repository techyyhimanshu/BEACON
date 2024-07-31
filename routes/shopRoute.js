const { Router } = require('express');
const {createShop,getAllShops,getSingleShop,updateShop,deleteShop}=require("../controllers/shopController");
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here

router.post("/api/shop",verifyToken,createShop)
// router.get("/api/shops",getAllShops)


router.get("/api/shop/:id",verifyToken,getSingleShop)
router.patch("/api/shop/:id",updateShop)
router.delete("/api/shop/:id",deleteShop)


module.exports = router;
