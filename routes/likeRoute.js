const { Router } = require('express');
const router = Router();
const { likeTemplate , templateLikes,userLikes}=require("../controllers/likeController")

// Define your routes here
router.post("/api/like/dynamicTemplate",likeTemplate)
router.get("/api/template/:id/likes",templateLikes)
router.post("/api/user/like",userLikes)


module.exports = router;