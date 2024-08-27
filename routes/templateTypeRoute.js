const { Router } = require('express');
const {createTempType, getAllTemplateType,categoryTemplate,    
    updateTemplate,    deleteTemplate, callSP} = require("../controllers/templatetypeController")
const router = Router();
// Define your routes here

router.post("/api/addTemplateType",createTempType)
router.get("/api/template-type/all",getAllTemplateType)
router.patch("/api/updateTemplateType",updateTemplate)
router.post("/api/deleteTemplateType",deleteTemplate)
router.post("/api/get-category-templateType",categoryTemplate)
router.post("/api/callSP",callSP)


module.exports = router;
