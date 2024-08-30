const { Router } = require('express');
const router = Router();
const { likeTemplate , templateLikes}=require("../controllers/likeController")

// Define your routes here
router.post("/api/like/dynamicTemplate",likeTemplate)
router.get("/api/template/:id/likes",templateLikes)

module.exports = router;