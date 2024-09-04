const { Router } = require('express');
const {createOrganization,getAllOrganization,getSingleOrganization,updateOrganization,
    getOrganizationMenu,deleteOrganization,getDivisionByOrganization, getAllBeaconOrgWise,
    getOrganizationBeacons}=require('../controllers/organizationController');
const verifyToken = require('../middlewares/authMiddleware');
const router = Router();
// Define your routes here
const checkId = (req, res, next) => {
    const { id } = req.params;    
    // Check if id is provided
    if (!id) {
        return res.status(400).json({
            status: 'failure',
            message: 'ID parameter is missing'
        });
    }

    // Optionally, you can add more validation for the ID (e.g., check if it's a number or valid format)
    if (isNaN(id)) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid ID format'
        });
    }

    // If ID is valid, proceed to the next middleware or controller
    next();
};
router.post("/api/organization",verifyToken,createOrganization)
router.get("/api/organizations",verifyToken,getAllOrganization)
// router.post("/api/organization/login",organizationLogin)
router.get("/api/organization/beacons",verifyToken,getAllBeaconOrgWise)


router.get("/api/organization/:id?",checkId,getSingleOrganization)
router.post("/api/organization/divisions",getDivisionByOrganization)
router.patch("/api/organization/:id?",verifyToken,checkId,updateOrganization)
router.delete("/api/organization/:id?",verifyToken,checkId,deleteOrganization)
router.get("/api/organization/:id?/beacons",verifyToken,checkId,getOrganizationBeacons)
router.get("/api/organization/:id?/menu",verifyToken,checkId,getOrganizationMenu)



module.exports = router;
