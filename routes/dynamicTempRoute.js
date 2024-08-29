const { Router } = require('express');
const router = Router();
const { craeteTemplate,
        getTemplate,
        getAllTemplate,
        updateTemplate,
        deleteTemplate,

        // buttons 
        getButton,
        updateButton,
        deleteButton,

        // content
        updateContent,
        getContent,
        deleteContent, 
        
        // submenu
        updateSubMenu,
        getAllSubMenu,
        craeteSubMenuTemplate,
        getSubMenuByTempId,
        getSubMenuByID,
        deleteSubMenu,
        
        // view
        templateView

}=require("../controllers/dynamicTempController")

// Define your routes here
router.post("/api/create/dynamicTemplate",craeteTemplate)
router.get("/api/fetch/dynamicTemplate/:id",getTemplate)
router.get("/api/fetch/dynamicTemplates",getAllTemplate)
router.patch("/api/update/dynamicTemplate/:id",updateTemplate)
router.put("/api/update/dynamicTemplate/:id",updateTemplate)
router.delete("/api/delete/dynamicTemplate/:id",deleteTemplate)

// widget routes
router.patch("/api/update/dynamicContent",updateContent)
router.patch("/api/update/dynamicButton",updateButton)
router.get("/api/fetch/dynamicButton/:id",getButton)
router.get("/api/fetch/dynamicContent/:id",getContent)
router.delete("/api/delete/dynamicButton/:id",deleteButton)
router.delete("/api/delete/dynamicContent/:id",deleteContent)

// sub menu routes 
router.get("/api/submenus",getAllSubMenu)
router.get("/api/submenus/:id",getSubMenuByID)
router.get("/api/templates/:id/submenus",getSubMenuByTempId)
router.post("/api/templates/:id/submenus",craeteSubMenuTemplate)
router.patch("/api/submenus/:id",updateSubMenu)
router.put("/api/submenus/:id",updateSubMenu)
router.delete("/api/submenus/:id",deleteSubMenu)

// view
router.get("/api/temp/:id/view",templateView)

module.exports = router;