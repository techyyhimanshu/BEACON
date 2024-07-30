const { Router } = require('express');
const {createOrganization,getAllOrganization,getSingleOrganization,updateOrganization,deleteOrganization,getShopsByOrganization}=require('../controllers/organizationController')
const router = Router();
// Define your routes here

router.post("/api/organization",createOrganization)
router.get("/api/organizations",getAllOrganization)


router.get("/api/organization/:id",getSingleOrganization)
router.get("/api/organization/:id/shops",getShopsByOrganization)
router.patch("/api/organization/:id",updateOrganization)
router.delete("/api/organization/:id",deleteOrganization)


module.exports = router;
