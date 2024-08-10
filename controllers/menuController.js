const db = require("../models")
const Sequelize = require("sequelize")
const Menu = db.menu

const createMenuItem = async (req, res) => {
    try {
        const insertedData=await Menu.create(req.body)
        if(insertedData.length!==0){
            res.status(200).json({ status: "success", message: "Created successfully" });
        }else{
            res.status(200).json({ status: "failure", message: "Error occured" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }

}
const getSingleMenuItem = async (req, res) => {
    try {
        const fetchedData=await Menu.findOne({
            where:{
                menu_id:req.params.id
            }
        })
        if(fetchedData.length!==0){
            res.status(200).json({ status: "success", data:fetchedData });
        }else{
            res.status(200).json({ status: "failure", message: "Error occured" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }

}
const getAllMenuItems = async (req, res) => {
    try {
        const fetchedData=await Menu.findAll()
        if(fetchedData.length!==0){
            res.status(200).json({ status: "success", data:fetchedData });
        }else{
            res.status(200).json({ status: "failure", message: "Error occured" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }

}
module.exports={
    createMenuItem,
    getSingleMenuItem,
    getAllMenuItems
}