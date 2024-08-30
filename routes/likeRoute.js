const { Router } = require('express');
const router = Router();
const { likeTemplate }=require("../controllers/likeController")

// Define your routes here
router.post("/api/like/dynamicTemplate",likeTemplate)
// router.get("/api/fetch/dynamicTemplate/:id",getTemplate)



module.exports = router;