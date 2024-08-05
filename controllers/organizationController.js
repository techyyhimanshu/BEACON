const db = require("../models")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const Organization = db.Organization
const Shop = db.Shop
const Sequelize = require("sequelize")

const createOrganization = async (req, res) => {
    try {
        const username = req.username
        if (username === "cit_superadmin") {
            console.log(req.body);
            const { org_name, address, contact_number, email } = req.body
            const data = await Organization.create(req.body)
            if (data) {
                res.status(200).json({ status: "success", message: "Created successfully" })
            }
        } else {
            res.status(401).json({ status: "failure", message: "Unauthorized" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }
    }

}
const getAllOrganization = async (req, res) => {
    try {
        const data = await Organization.findAll({
            attributes: ['org_id', 'org_name', 'address', 'contact_number', 'email']
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure" });
    }

}
const getSingleOrganization = async (req, res) => {
    try {
        const data = await Organization.findOne({
            attributes: ['org_name', 'address', 'contact_number', 'email'],
            where: {
                org_id: req.params.id
            }
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure" });
    }

}
const updateOrganization = async (req, res) => {
    try {
        const [affectedRow] = await Organization.update(req.body, {
            where: {
                org_id: req.params.id
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
const deleteOrganization = async (req, res) => {
    try {
        const affectedRow = await Organization.destroy({
            where: {
                org_id: req.params.id
            }
        })
        if (affectedRow === 1) {
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

const getShopsByOrganization = async (req, res) => {
    try {
        const data = await Shop.findAll({
            attributes: ['shop_name', 'shop_no'],
            where: {
                org_id: req.body.org_id
            },
            include: [{
                model: db.Category,
                attributes: ['category_name']
            }]
        })
        const catName = data[0].dataValues.Category.category_name
        const shops = data.map(shop => ({
            shop_name: shop.dataValues.shop_name,
            shop_no: shop.dataValues.shop_no,
            category: catName
        }));
        if (shops) {
            res.status(200).json({ status: "success", data: shops })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failure" });
    }

}
const getOrganizationBeacons = async (req, res) => {
    try {
        const orgBeacons = await db.sequelize.query('select beacon_id,beacon_name,mac from beaconDB.Beacons where shop_id in(select shop_id from beaconDB.ShopDetails where org_id=?)',
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.params.id]
            })
        if (orgBeacons.length !== 0) {
            res.status(200).json({ status: "success", data: orgBeacons })
        } else {
            res.status(404).json({ status: "Not found", message: "no beacon added to this shop" })
        }
    } catch (e) { res.status(400).json({ status: "failure", message: e.message }); }
}

module.exports = {
    createOrganization,
    getAllOrganization,
    getSingleOrganization,
    updateOrganization,
    deleteOrganization,
    getShopsByOrganization,
    getOrganizationBeacons
}