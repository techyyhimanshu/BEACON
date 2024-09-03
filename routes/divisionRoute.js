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

router.post("/api/division",verifyToken,createDivision)
router.get("/api/divisions",verifyToken,getAlldivisions)
router.post("/api/division/login",DivisionLogin)
router.get("/api/org/:id/divisionWiseBeacons",getAllBeaconDivisionWise)


router.get("/api/division/:id",verifyToken,getSingleDivision)
router.put("/api/division/:id",verifyToken,updateDivision)
router.delete("/api/division/:id",verifyToken,deleteDivision)
router.get("/api/division/:id/beacons/list",verifyToken,getDivBeacon)
router.post("/api/division/notification",divNotification)


module.exports = router;
