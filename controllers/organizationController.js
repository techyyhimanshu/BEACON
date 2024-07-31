const db = require("../models")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const Organization = db.Organization
const Shop = db.Shop
const Sequelize = require("sequelize")

const createOrganization = async (req, res) => {
    try {
        const hashedPassword = await argon2.hash("123456")
        const { org_name, address, contact_number, email } = req.body
        const data = await Organization.create({
            org_name: org_name,
            address: address,
            email: email,
            contact_number: contact_number,
            password_hash: hashedPassword
        })
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
const getAllOrganization = async (req, res) => {
    try {
        const data = await Organization.findAll({
            attributes: ['org_name', 'address', 'contact_number', 'email']
        })
        if (data) {
            res.status(200).json({ status: "success", message: data })
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
            res.status(200).json({ status: "success", message: data })
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
                org_id: req.org_id
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
        if (data) {
            res.status(200).json({ status: "success", shops: shops })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure" });
    }

}

const organizationLogin = async (req, res) => {
    try {
        const data = await Organization.findOne({
            attributes:['email','password_hash','org_id','org_name'],
            where: { email: req.body.email }
        });
        if (data) {
            const password=data.password_hash
            const matchedPassword=await argon2.verify(password,req.body.password)
            if(matchedPassword){
                const tokenPayload={
                    org_id:data.org_id,
                    organization_name:data.org_name,
                }
                const token=jwt.sign(tokenPayload,process.env.JWT_SECRET,{expiresIn:'30m'})
                res.status(200).json({ status: "success", message: "Login successfully",token });
            }else{
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
    createOrganization,
    getAllOrganization,
    getSingleOrganization,
    updateOrganization,
    deleteOrganization,
    getShopsByOrganization,
    organizationLogin
}