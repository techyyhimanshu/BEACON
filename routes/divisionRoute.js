const { Router } = require('express');
const {createDivision,
    getAlldivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
    DivisionLogin,
    getDivBeacon,
    divNotification,
    getAllBeaconDivisionWise }=require("../controllers/divisionController");
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


router.post("/api/division",verifyToken,createDivision)
router.get("/api/divisions",verifyToken,getAlldivisions)
router.post("/api/division/login",DivisionLogin)
router.get("/api/org/:id?/divisionWiseBeacons",verifyToken,checkId,getAllBeaconDivisionWise)


router.get("/api/division/:id?",verifyToken,checkId,getSingleDivision)
router.patch("/api/division/:id?",verifyToken,checkId,updateDivision)
router.delete("/api/division/:id?",verifyToken,checkId,deleteDivision)
router.get("/api/division/:id?/beacons/list",verifyToken,checkId,getDivBeacon)
router.post("/api/division/notification",divNotification)


module.exports = router;
