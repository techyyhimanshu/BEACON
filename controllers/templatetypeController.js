const db = require("../models")
const Category = db.Category
const TemplateType = db.temptype
const Sequelize = require("sequelize")
const temptype = require("../models/temptype")

const createTempType = async (req, res) => {
    try {
        const data = await TemplateType.create({
            category_id: req.body.category_id,
            template_path: req.body.template_path
        })
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" })
        }
        else{
            res.status(200).json({ status: "fail", message: "data is not faount" ,data:data })
        }

    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            res.status(400).json({ status: "failure", message: error.message });
        }

    }

}
const getAllTemplateType = async (req, res) => {
    try {
        const data = await TemplateType.findAll({
            attributes: ['template_path','templateType_id'],
            include : {
                model : Category,
                attributes : ["category_name"]
            }
            // include:[{
            //     model:Organization,
            //     attributes:["org_name"]
            // }]
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else{
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }

}

const categoryTemplate = async (req, res) => {
    try {
        const catTempData = await TemplateType.findAll({},{
             where: {
                category_id:req.body.category_id
            }
        })
        if (catTempData) {
            res.status(200).json({ status: "success", data: catTempData})
        }
        else{
            res.status(404).json({ status: "failure", message: "Record not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }
}


const updateTemplate = async (req, res) => {
    try {
        const [affectedRow] = await TemplateType.update({
            template_path : req.body.template_path,
            category_id : req.body.category_id
        },{
             where: {
                templateType_id:req.body.templateType_id
            }
        })
        if (affectedRow===1) {
            res.status(200).json({ status: "success", message: "Updated successfully" })
        }
        else{
            res.status(404).json({ status: "failure", message: "Record not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }
}


const deleteTemplate = async (req, res) => {
    try {
        const affectedRow = await TemplateType.destroy({
             where: {
                templateType_id:req.body.templateType_id
            }
        })
        if (affectedRow===1) {
            res.status(200).json({ status: "success", message: "Deleted successfully" })
        }
        else{
            res.status(404).json({ status: "failure", message: "Record not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }

}
module.exports = {
    createTempType,
    getAllTemplateType,
    categoryTemplate,
    updateTemplate,
    deleteTemplate
}