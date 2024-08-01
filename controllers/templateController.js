const db = require("../models")
const Category = db.Category
const TemplateType = db.temptype
const Template = db.template
const Shop = db.Shop
const Beacon = db.Beacon



const Sequelize = require("sequelize")
//const temptype = require("../models/temptype")


const createTemplate = async (req, res) => {

    try {
        const data = await Template.create({
            templateType_id: req.body.templateType_id,
            valid_from: req.body.valid_from,
            valid_till:req.body.valid_till,
            offer_data_1:req.body.offer_data_1,
            offer_data_2:req.body.offer_data_2
        })
        console.log(data.template_id);
        if (data) {

            var addToBeacon = await Beacon.update(
                {template_id:data.template_id},{
                where : {
                    // comment after token
                    beacon_id : req.body.beacon_id
                    // beacon_id : req.beacon_id ;
                }
            })
            if (addToBeacon==0){
                res.status(200).json({ status: "failure", message: "no beacon asign to this shop" })
            }
            else{
                res.status(200).json({ status: "success", message: "Created successfully" })
            }
        }
        else{
            res.status(200).json({ status: "fail", message: "data is not found" ,data:data })
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


const getShopBeacon = async (req,res) => {
    try{
        const shopBeacons = await Beacon.findAll({
            attributes : ["beacon_id","beacon_name"],
            where : {
                shop_id : req.body.shop_id
            }
        })
        if (shopBeacons){
            res.status(400).json({ status: "success", message: shopBeacons })
        } else {
            res.status(400).json({ status: "success", message: "no beacon added to this shop" })
        }
    }catch(e)
    {res.status(400).json({ status: "failure", message: e.message });}
}


const getAllTemplate = async (req, res) => {
    try {
        const data = await Template.findAll({
            attributes: ['templateType_id','valid_from','valid_till','offer_data_1','offer_data_2'],
            include : {
                model : TemplateType,
                attributes : ["template_path"]
            }
        })
        if (data) {
            res.status(200).json({ status: "success", message: data })
        }
        else{
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }
}


const getMyTemplate = async (req, res) => {
    try {
        console.log("get my templte method call");
        const data = await Beacon.findAll({
            attributes : ['beacon_name'],
            include :[{
                model:Template ,
                attributes : ['templateType_id','valid_from','valid_till','offer_data_1','offer_data_2'],
                order:[
                    ['valid_till','ASC']
                ]
            },{
                model:Shop ,
                attributes : ['shop_name'],
            }
        ],
            where:{
                // cmment it after token
                shop_id : req.body.shop_id
            }
            
        })
        if (data) {
            res.status(200).json({ status: "success", message: data })
        }
        else{
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }

}

const updateMyTemplate = async (req, res) => {
    try {
        const [affectedRow] = await Template.update({
            templateType_id: req.body.templateType_id,
            valid_from: req.body.templateType_id,
            valid_till:req.body.valid_till,
            offer_data_1:req.body.offer_data_1,
            offer_data_2:req.body.offer_data_2
        },{
             where: {
                template_id:req.body.template_id
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
const deleteMyTemplate = async (req, res) => {
    try {
        const affectedRow = await Template.destroy({
             where: {
                template_id:req.body.template_id
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
    createTemplate,
    getAllTemplate,
    updateMyTemplate,
    deleteMyTemplate,
    getShopBeacon,
    getMyTemplate
}