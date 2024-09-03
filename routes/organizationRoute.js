const { Router } = require('express');
const {createOrganization,getAllOrganization,getSingleOrganization,updateOrganization,
    getOrganizationMenu,deleteOrganization,getDivisionByOrganization, getAllBeaconOrgWise,
    getOrganizationBeacons}=require('../controllers/organizationController');
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here

router.post("/api/organization",verifyToken,createOrganization)
router.get("/api/organizations",verifyToken,getAllOrganization)
// router.post("/api/organization/login",organizationLogin)
router.get("/api/organization/beacons",getAllBeaconOrgWise)


router.get("/api/organization/:id",getSingleOrganization)
router.post("/api/organization/divisions",getDivisionByOrganization)
router.patch("/api/organization/:id",verifyToken,updateOrganization)
router.delete("/api/organization/:id",verifyToken,deleteOrganization)
router.get("/api/organization/:id/beacons",verifyToken,getOrganizationBeacons)
router.get("/api/organization/:id/menu",getOrganizationMenu)



module.exports = router;
