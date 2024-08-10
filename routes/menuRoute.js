const { Router } = require('express');
const router = Router();
const {createMenuItem, getAllMenuItems, getSingleMenuItem}=require("../controllers/menuController")
// Define your routes here

router.post("/api/menu",createMenuItem)
router.get("/api/menu/items",getAllMenuItems)
router.get("/api/menu/item/:id",getSingleMenuItem)


module.exports = router;
