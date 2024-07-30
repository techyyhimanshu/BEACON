const db = require("../models")
const Beacon = db.Beacon
const Shop = db.Shop
const Sequelize = require("sequelize")

const addBeacon = async (req, res) => {
    try {
        const shop = await Shop.findByPk(req.body.shop_id);
        if(!shop){
            return res.status(404).json({ status: "failure", message: "Shop not found" });
        }
        const data = await Beacon.create(req.body)
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            console.log(error);
        }
    }

}
const login = async (req, res) => {
    try {
        const data = await Beacon.findOne({
            where:{
                mac:req.body.mac
            }
        })
        if (data) {
            res.status(200).json({ status: "success", url:"https://www.google.com" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            console.log(error);
        }
    }

}
module.exports={
    addBeacon,
    login
}