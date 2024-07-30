const db = require("../models")
const Shop = db.Shop
const Organization = db.Organization
const Sequelize = require("sequelize")

const createShop = async (req, res) => {
    try {
        const data = await Shop.create(req.body)
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }
    }

}
const getAllShops = async (req, res) => {
    try {
        const data = await Shop.findAll({
            attributes: ['shop_name','shop_no','contact_number','email'],
            // include:[{
            //     model:Organization,
            //     attributes:["org_name"]
            // }]
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
const getSingleShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({
            attributes:['shop_name','shop_no','contact_number','email'],
             where: {
                shop_id:req.params.id
            }
        })
        if (shop) {
            res.status(200).json({ status: "success", message: shop })
        }
        else{
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure" });
    }

}
const updateShop = async (req, res) => {
    try {
        const [affectedRow] = await Shop.update(req.body,{
             where: {
                shop_id:req.params.id
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
const deleteShop = async (req, res) => {
    try {
        const affectedRow = await Shop.destroy({
             where: {
                shop_id:req.params.id
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
    createShop,
    getAllShops,
    getSingleShop,
    updateShop,
    deleteShop
}