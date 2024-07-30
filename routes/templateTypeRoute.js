const { Router } = require('express');
const {createTempType, getAllTemplateType,    updateTemplate,    deleteTemplate} = require("../controllers/templatetypeController")
const router = Router();
// Define your routes here

router.post("/api/addTemplateType",createTempType)
router.get("/api/TemplateType/all",getAllTemplateType)
router.patch("/api/updateTemplateType/",updateTemplate)
router.post("/api/deleteTemplateType",deleteTemplate)

module.exports = router;
