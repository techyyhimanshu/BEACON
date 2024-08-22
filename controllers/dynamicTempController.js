const db = require("../models");
const TempButton =db.tbl_temp_button;
const TempContent =db.tbl_temp_content;
const TempSubMenu =db.tbl_temp_menu;
const Template =db.tbl_template;

// CREATE NEW TEMPLATE
const craeteTemplate= async(req,res)=>{
try {
    const  template =await Template.create({
        title : req.body.title,
        description : req.body.description,
        imagePath : req.body.imageUrl,
        textColor: req.body.textColor,
        backgroundColor: req.body.backgroundColor,
        buttonColor: req.body.buttonColor,
    })
    if (template){
        // BUTTONS
        var buttons = req.body.buttons;
        buttons.forEach(button => {
            button.temp_id = template.temp_id  
        });
        var tempButton = await TempButton.bulkCreate(buttons);
        console.log(tempButton);
        
        // CONTENTS
        var contents = req.body.texts;
        contents.forEach(content => {
            content.temp_id = template.temp_id  
        });
        var tempContent = await TempContent.bulkCreate(contents);
        console.log(tempContent);
        

        // SUB LINKS
        // var subMenus = req.body.submenus;
        // subMenus.forEach(subMenu => {
        //     subMenu.temp_id = template.temp_id  
        // });
        // var tempSubMenu = await TempSubMenu.bulkCreate(subMenus);
        // console.log(tempSubMenu);
        
    
        if(tempButton.length > 0 && tempContent.length > 0 ){
            res.status(200).json({status:"success",data:[template,tempButton,tempContent],temp_Id:template.temp_id}) 
        }
        else{
            res.status(200).json({status:"failure",message:"template Widgets not created"})
        }
    } else {
        res.status(404).json({status:"failure",message:"template not created"})
    }
} catch (error) {
    res.status(404).json({status:"failure",message:"Internal server error"})
}
}

// SELECT ALL DATA OF A TEMPLATE
const getTemplate= async(req,res)=>{
    try {
        console.log(req.params.id);
        
        const  template =await Template.findAll({
            attributes :['title','description','imagePath','textColor','backgroundColor','buttonColor'],
            include:[
                {
                    model : TempContent,
                    attributes : ['content_id','text_content','background_color','textColor',]
                },
                {
                    model : TempButton,
                    attributes : ['button_id','text','background_color','textColor','button_url']
                },
                {
                    model: TempSubMenu,
                    attributes: ['subMenu_id','menu_name','textColor','link_url']
                }
            ],
            where:{
                temp_id : req.params.id
            }
        })
        
        if(template.length > 0){
            res.status(200).json({status:"success",data:template})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
    }
}

// GET ALL TEMPLATES
const getAllTemplate= async(req,res)=>{
    try {
        const  {count, rows} =await Template.findAndCountAll({
            attributes :['temp_id','title','description','imagePath','textColor','backgroundColor','buttonColor'],
            include:[
                {
                    model : TempContent,
                    attributes : ['content_id','text_content','background_color','textColor',]
                },
                {
                    model : TempButton,
                    attributes : ['button_id','text','background_color','textColor','button_url']
                },
                {
                    model: TempSubMenu,
                    attributes: ['subMenu_id','menu_name','textColor','link_url']
                }
            ]
        })
        if(count > 0){
            res.status(200).json({status:"success",count:count, data:rows})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
    }
}

// UPDATE TEMPLATE 
const updateTemplate= async(req,res)=>{
    try {
        const  templateUpdate =await Template.update({
            title : req.body.title,
            description : req.body.description,
            imagePath : req.body.imagePath,
            textColor: req.body.textColor,
            backgroundColor: req.body.backgroundColor,
            buttonColor: req.body.buttonColor,
        },{
            where: {
                temp_id : req.params.id
            }
        })
        if(templateUpdate > 0){
            res.status(200).json({status:"success",row_Affected:templateUpdate[0]})     
        } else {
            res.status(404).json({status:"failure",message:"template not Updated"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
    }
}

// UPDATE BUTTON 
const updateButton= async(req,res)=>{
    try {
        const  butttonUpdate =await TempButton.update({
            text : req.body.text,
            background_color : req.body.background_color,
            textColor : req.body.textColor,
            button_url: req.body.button_url
        },{
            where: {
                button_id : req.body.button_id
            }
        })
        if(butttonUpdate > 0){
            res.status(200).json({status:"success",row_Affected:butttonUpdate[0]})     
        } else {
            res.status(404).json({status:"failure",message:"button not updated"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);
        
    }
}

// UPDATE CONTENT 
const updateContent= async(req,res)=>{
    try {
        const  contentUpdate =await TempContent.update({
            text_content : req.body.text_content,
            background_color : req.body.background_color,
            textColor : req.body.textColor
        },{
            where: {
                content_id : req.body.content_id
            }
        })
        if(contentUpdate > 0){
            res.status(200).json({status:"success",row_Affected:contentUpdate[0]})     
        } else {
            res.status(404).json({status:"failure",message:"content is not updated"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);
        
    }
}

// delete template - not completed
const deleteTemplate= async(req,res)=>{
    try {        
        const  template =await Template.destroy({
            where:{
                temp_id : req.params.id
            }
        });
        const  templateButton =await TempButton.destroy({
            where:{
                temp_id : req.params.id
            }
        });
        const  templateContent =await TempContent.destroy({
            where:{
                temp_id : req.params.id
            }
        });
        const  templateSubMenu =await TempSubMenu.destroy({
            where:{
                temp_id : req.params.id
            }
        })

        if(template > 0){
            res.status(200).json({status:"success",message:"data deleted"})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);        
    }
}

// CREATE SUB MENU WITH TEMPLATE
const craeteSubMenuTemplate= async(req,res)=>{
    try {
        const Temp = await Template.findOne({
            where:{
                temp_id : req.params.id
            }
        });
        if(Temp){
                const  tempSubMenu =await TempSubMenu.create({
                temp_id : req.params.id,
                menu_name : req.body.menu_name,
                textColor : req.body.textColor,
                link_url : req.body.link_url
                });
                console.log(tempSubMenu);
            
                if(tempSubMenu){
                    res.status(200).json({status:"success",data:tempSubMenu,temp_Id:tempSubMenu.temp_id}) 
                }
                else{
                    res.status(200).json({status:"failure",message:"sub menu is not created "})
                }
            } else{
                res.status(200).json({status:"failure",message:`Template Id : ${req.params.id} is not exist`})
            }
        } catch (error) {
            res.status(404).json({status:"failure",message:"Internal server error"})
            console.log(error.message);
            
        }
}

// get submenu by submenu id
const getSubMenuByID = async(req,res)=>{
    try{
        const  templateSubMenu =await TempSubMenu.findOne({
            attributes :["subMenu_id","temp_id","menu_name","textColor","link_url"],
            where:{
                subMenu_id : req.params.id
            }
        });
        if(templateSubMenu){
            res.status(200).json({status:"success",data:templateSubMenu})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);  
    }
}

// get submenu by temp id 
const getSubMenuByTempId = async(req,res)=>{
    try{
        const  templateSubMenu =await TempSubMenu.findAll({
            attributes :["subMenu_id","temp_id","menu_name","textColor","link_url"],
            where:{
                temp_id : req.params.id
            }
        });
        if(templateSubMenu){
            res.status(200).json({status:"success",data:templateSubMenu})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);  
    }
}

// get  all submenu
const getAllSubMenu = async(req,res)=>{
    try{
        const  templateSubMenu =await TempSubMenu.findAll({
            attributes :["subMenu_id","temp_id","menu_name","textColor","link_url"]
        });
        if(templateSubMenu){
            res.status(200).json({status:"success",data:templateSubMenu})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);  
    }
}
// UPDATE SUB MENU 
const updateSubMenu = async(req,res)=>{
    try {
        const  subMenutUpdate =await TempSubMenu.update({
            menu_name : req.body.menu_name,
            textColor : req.body.textColor,
            link_url : req.body.link_url
        },{
            where: {
                subMenu_id : req.params.id
            }
        })
        console.log(subMenutUpdate > 0);
        
        if(subMenutUpdate){
            res.status(200).json({status:"success",row_Affected:subMenutUpdate[0]})     
        } else {
            res.status(404).json({status:"failure",message:"submenu is not updated"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message)
    }
}

// delete sub menu by id 
const deleteSubMenu = async(req,res)=>{
    try{
        const  templateSubMenu =await TempSubMenu.destroy({
            where:{
                subMenu_id : req.params.id
            }
        });
        if(templateSubMenu > 0 ){
            res.status(200).json({status:"success",message:`sub menu ${req.params.id} deleted successfully`})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(error.message);  
    }
}

// GET BUTTON BY BUTTON ID
const getButton = async(req,res)=>{
    try{
        const  templateButton =await TempButton.findOne({
            attributes :["button_id","temp_id","text","background_color","textColor","button_url"],
            where:{
                button_id : req.params.id
            }
        });
        if(templateButton){
            res.status(200).json({status:"success",data:templateButton})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(e.message);  
    }
}

// GET CONTENT BY CONTENT ID
const getContent = async(req,res)=>{
    try{
        const  templateContent =await TempContent.findOne({
            attributes : ["content_id","temp_id","text_content","background_color","textColor"],
            where:{
                content_id : req.params.id
            }
        });
        if(templateContent){
            res.status(200).json({status:"success",data:templateContent})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(e.message);  
    }
}

// DELETE BUTTON BY BUTTON ID
const deleteButton = async(req,res)=>{
    try{
        const  templateButton =await TempButton.destroy({
            where:{
                button_id : req.params.id
            }
        });
        if(templateButton > 0){
            res.status(200).json({status:"success",message:'button deleted successfully',row_Affected:templateButton[0]})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(e.message);  
    }
}

// DELETE CONTENT BY CONTENT ID
const deleteContent = async(req,res)=>{
    try{
        const  templateContent =await TempContent.destroy({
            where:{
                content_id : req.params.id
            }
        });
        if(templateContent > 0){
            res.status(200).json({status:"success",message:'content deleted successfully',row_Affected:templateContent[0]})
        }
        else{
            res.status(404).json({status:"failure",message:"data not found"})
        }
    }catch(e){
        res.status(404).json({status:"failure",message:"Internal server error"})
        console.log(e.message);  
    }
}

// export methos
module.exports = {
    craeteTemplate,
    getTemplate,
    getAllTemplate,
    updateTemplate,
    deleteTemplate,

    // SUB MENU METHODS 
    craeteSubMenuTemplate,
    getSubMenuByTempId,
    getSubMenuByID,
    getAllSubMenu,
    updateSubMenu,
    deleteSubMenu,

    // WIDGET METHODS
    getContent,
    getButton,
    updateButton,
    updateContent,
    deleteContent,
    deleteButton
}