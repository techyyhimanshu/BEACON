const { Router } = require('express');
const {callSP }=require("../controllers/SP");
const verifyToken = require('../middlewares/authMiddleware');

const router = Router();



// Define your routes here

// router.post("/api/callSp",callSP)