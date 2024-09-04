const { Router } = require('express');
const {createTemplate, createChildTemplate,  getAllTemplate,getMyTemplate,
    asignTemplateToBeacon, updateMyTemplate,  deleteMyTemplate }=require("../controllers/templateController")
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');
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
router.post("/api/template",createTemplate)
router.get("/api/templates",getAllTemplate)
router.get("/api/template/:id?",checkId,getMyTemplate)
router.patch("/api/template/update",updateMyTemplate)
router.post("/api/template/delete",deleteMyTemplate)
router.post("/api/template/asign",asignTemplateToBeacon)
router.post("/api/template/crateChild",createChildTemplate)


module.exports = router;
