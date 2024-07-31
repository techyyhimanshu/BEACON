const { Router } = require('express');
const {createOrganization,getAllOrganization,getSingleOrganization,updateOrganization,deleteOrganization,getShopsByOrganization}=require('../controllers/organizationController');
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here

router.post("/api/organization",verifyToken,createOrganization)
router.get("/api/organizations",getAllOrganization)
// router.post("/api/organization/login",organizationLogin)


router.get("/api/organization/:id",getSingleOrganization)
router.post("/api/organization/shops",verifyToken,getShopsByOrganization)
router.patch("/api/organization/:id",updateOrganization)
router.delete("/api/organization/:id",deleteOrganization)


module.exports = router;
