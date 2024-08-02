const db = require("../models")
const Shop = db.Shop
const Beacon = db.Beacon
const Sequelize = require("sequelize")
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const createShop = async (req, res) => {
    try {
        const username = req.username
        if (username === "cit_superadmin") {
            const { shop_name, shop_no, category, contact_number, email, org_id } = req.body
            const categoryID = await db.Category.findOne({
                where: { category_id: category }
            })
            const organizationID = await db.Organization.findOne({
                where: { org_id:org_id }
            })
            if (!categoryID) {
                res.status(404).json({ status: "faiulre", message: "Category not found" })
            }else if(!organizationID){
                res.status(404).json({ status: "faiulre", message: "Organization not found" })
            } else {
                const password = req.body.password
                const hashedPassword = await argon2.hash(password)
                const data = await Shop.create({
                    shop_name: shop_name,
                    shop_no: shop_no,
                    contact_number: contact_number,
                    category: category,
                    email: email,
                    org_id: org_id,
                    password_hash: hashedPassword
                })
                if (data) {
                    res.status(200).json({ status: "success", message: "Created successfully" })
                }else {
                    res.status(401).json({ status: "failure", message: "Unauthorized" });
                }
            }
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
            attributes: ['shop_name', 'shop_no', 'contact_number', 'email'],
            // include:[{
            //     model:Organization,
            //     attributes:["org_name"]
            // }]
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
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
            attributes: ['shop_name', 'shop_no', 'contact_number', 'email'],
            where: {
                shop_id: req.params.id
            }
        })
        if (shop) {
            res.status(200).json({ status: "success", data: shop })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure" });
    }

}
const updateShop = async (req, res) => {
    try {
        const [affectedRow] = await Shop.update(req.body, {
            where: {
                shop_id: req.params.id
            }
        })
        if (affectedRow === 1) {
            res.status(200).json({ status: "success", message: "Updated successfully" })
        }
        else {
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
                shop_id: req.params.id
            }
        })
        if (affectedRow === 1) {
            await Beacon.destroy({
                where: {
                    shop_id: req.params.id
                }
            })
            res.status(200).json({ status: "success", message: "Deleted successfully" })
        }
        else {
            res.status(404).json({ status: "failure", message: "Record not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }

}
const shopLogin = async (req, res) => {
    try {
        const data = await Shop.findOne({
            attributes: ['email', 'password_hash', 'org_id', 'shop_name', 'shop_id'],
            where: { email: req.body.email }
        });
        if (data) {
            const password = data.password_hash
            const matchedPassword = await argon2.verify(password, req.body.password)
            if (matchedPassword) {
                const tokenPayload = {
                    org_id: data.org_id,
                    shop_id: data.shop_id,
                    shop_name: data.shop_name
                }
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30m' })
                res.status(200).json({ status: "success",authorization:token });
            } else {
                res.status(200).json({ status: "failure", message: "Login failed" });
            }
        } else {
            res.status(200).json({ status: "failure", message: "Login failed" });
        }
    } catch (error) {
        // Handle Sequelize validation errors
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            // Log any other errors and return a 500 internal server error response
            console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};

module.exports = {
    createShop,
    getAllShops,
    getSingleShop,
    updateShop,
    deleteShop,
    shopLogin
}