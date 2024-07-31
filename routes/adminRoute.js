const { Router } = require('express');
const {adminLogin}=require('../controllers/adminController');
const router = Router();

router.post("/api/superadmin/login",adminLogin)

module.exports=router