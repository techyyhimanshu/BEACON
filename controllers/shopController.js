const db = require("../models")
const Shop = db.Shop
const Beacon = db.Beacon
const Organization = db.Organization
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
                where: { org_id: org_id }
            })
            if (!categoryID) {
                res.status(404).json({ status: "faiulre", message: "Category not found" })
            } else if (!organizationID) {
                res.status(404).json({ status: "faiulre", message: "Organization not found" })
            } else {
                const data = await Shop.create({
                    shop_name: shop_name,
                    shop_no: shop_no,
                    contact_number: contact_number,
                    category: category,
                    email: email,
                    org_id: org_id,
                })
                if (data) {
                    res.status(200).json({ status: "success", message: "Created successfully" })
                } else {
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
            attributes: ['shop_id', 'shop_name', 'shop_no', 'contact_number', 'email'],
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
            attributes: ['shop_id', 'shop_name', 'shop_no', 'contact_number', 'email'],
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
        if (req.username === 'cit_superadmin') {
            if (req.body.org_id) {
                const orgID = req.body.org_id
                const catID = req.body.category_id
                const Organization = await db.Organization.findOne({
                    attributes: ['org_id'],
                    where: {
                        org_id: orgID
                    }
                })
                if (!Organization) {
                    res.status(404).json({ status: "failure", message: "Organization not found" })
                } else {
                    if (req.body.category_id) {
                        const Category = await db.Category.findOne({
                            attributes: ['category_id'],
                            where: {
                                category_id: catID
                            }
                        })
                        if (!Category) {
                            res.status(404).json({ status: "failure", message: "Category not found" })
                        } else {
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
                        }
                    }else{
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
                    }
                }
            }else{
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
            }
        } else {
            res.status(403).json({ status: "failure", message: "Unauthorized" })
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
                const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' })
                res.status(200).json({ status: "success", token: token });
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
const getShopBeacon = async (req, res) => {
    try {
        const shopBeacons = await Beacon.findAll({
            attributes: ["beacon_id","beacon_name", "mac"],
            where: {
                shop_id: req.params.id
            }
        })
        if (shopBeacons.length !== 0) {
            res.status(200).json({ status: "success", data: shopBeacons })
        } else {
            res.status(404).json({ status: "Not found", message: "no beacon added to this shop" })
        }
    } catch (e) { res.status(400).json({ status: "failure", message: e.message }); }
}
const shopNotification = async (req, res) => {
    try {
        const { shop_id, hourTime,description } = req.body;

        const query = `
            SELECT DISTINCT device_id 
            FROM BeaconVisited,DeviceFcmTokens
            WHERE beacon_mac IN (SELECT mac FROM Beacons WHERE shop_id = ?)
            AND BeaconVisited.createdAt > (CURDATE() - INTERVAL ? HOUR)
            AND DeviceFcmTokens.device_id = BeaconVisited.user_mac
            ORDER BY BeaconVisited.createdAt DESC;
        `;

        const replacements = [shop_id, hourTime];

        const shopUsers = await db.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        if (shopUsers.length === 0) {
            return res.status(404).json({ status: "Not found", message: "No users connected in this time interval" });
        }

        const shopDetail = await db.sequelize.query(
           `SELECT shop_name,shop_no,ShopDetails.contact_number,org_name,address
            FROM OrganizationDetails,ShopDetails
            WHERE ShopDetails.org_id =OrganizationDetails.org_id 
            AND ShopDetails.shop_id = ? `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [shop_id]
            }
        );

        const { contact_number, shop_name, shop_no, org_name, address } = shopDetail[0];

        const notification = `Dear Customer,Notification description here... ${description} Just dial: ${contact_number}  Go to: ${shop_name}, ${shop_no}, ${org_name}, ${address}`;

        return res.status(200).json({ 
            status: "success", 
            Notification: notification, 
            deviceUniqueIDs: shopUsers 
        });

    } catch (e) {
        return res.status(400).json({ status: "failure", message: e.message });
    }
};
const getAllBeaconDivisionWise = async (req, res) => {
    try {
        const data = await Organization.findOne({
            attributes: ['org_id'],
            where: {
                org_id: req.params.id
            }
        });
        if (!data) {
            return res.status(200).json({ status: "failure",message : "organization ID is not valid" })
        }
        const orgBeaconShopWise = await db.sequelize.query(`
            SELECT ShopDetails.shop_id AS div_ID,
            ShopDetails.shop_name AS division,
            (SELECT COUNT(*) FROM Beacons 
            WHERE Beacons.shop_id = ShopDetails.shop_id
            AND Beacons.deletedAt IS NULL) AS beacons_in_division,
            Beacons.beacon_id, Beacons.beacon_name FROM ShopDetails
            JOIN Beacons ON Beacons.shop_id = ShopDetails.shop_id
            WHERE ShopDetails.org_id = ?
            AND Beacons.deletedAt IS NULL
            GROUP BY ShopDetails.shop_id,
            ShopDetails.shop_name,
            Beacons.beacon_id,
            Beacons.beacon_name
            ORDER BY ShopDetails.shop_id,
            Beacons.beacon_name;
        `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements : [req.params.id]
            })
        if (orgBeaconShopWise) {
            return res.status(200).json({ status: "success", data: orgBeaconShopWise })
        } else {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        return res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}


module.exports = {
    createShop,
    getAllShops,
    getSingleShop,
    updateShop,
    deleteShop,
    shopLogin,
    getShopBeacon,
    shopNotification,
    getAllBeaconDivisionWise
}