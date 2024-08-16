const { Router } = require('express');
const router = Router();
const {craeteTemplate,
    getTemplate,
    getAllTemplate,
    updateTemplate,
    updateButton,
    updateContent,
    updateSubMenu,
    deleteTemplate}=require("../controllers/dynamicTempController")

    // Define your routes here
router.post("/api/create/dynamicTemplate",craeteTemplate)
router.get("/api/fetch/dynamicTemplate/:id",getTemplate)
router.get("/api/fetch/dynamicTemplates",getAllTemplate)
router.patch("/api/update/dynamicTemplate",updateTemplate)
router.patch("/api/update/dynamicSubmenu",updateSubMenu)
router.patch("/api/update/dynamicContent",updateContent)
router.patch("/api/update/dynamicButton",updateButton)
router.delete("/api/delete/dynamicTemplate/:id",deleteTemplate)

module.exports = router;