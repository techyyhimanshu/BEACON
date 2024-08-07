const { Router } = require('express');
const router = Router();
const {getAllCategories, addCategory}=require("../controllers/categoryController")
// Define your routes here

router.get("/api/categories",getAllCategories)
router.post("/api/category/add",addCategory)


module.exports = router;
