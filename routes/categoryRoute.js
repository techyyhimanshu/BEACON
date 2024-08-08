const { Router } = require('express');
const router = Router();
const {getAllCategories, addCategory}=require("../controllers/categoryController")
// Define your routes here

router.get("/api/categories",getAllCategories)

module.exports = router;
