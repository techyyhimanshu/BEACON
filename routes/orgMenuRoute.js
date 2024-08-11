const { Router } = require('express');
const router = Router();
const {createOrgMenuItem, getOrgMenuItems}=require("../controllers/orgMenuControlller")
// Define your routes here

router.post("/api/org/menu",createOrgMenuItem)
router.get("/api/org/:id/menu/items",getOrgMenuItems)
module.exports = router;
