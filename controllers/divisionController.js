const db = require("../models")
const Division = db.Division
const Beacon = db.Beacon
const Organization = db.Organization
const Sequelize = require("sequelize")
const argon2 = require('argon2') 
const jwt = require('jsonwebtoken')

const createDivision = async (req, res) => {
    try {
        const username = req.username
        if (username === "cit_superadmin") {
            const { div_name, div_no, category, contact_number, email, org_id } = req.body
            if(!category){
                return res.status(400).json({status:"failure", message: "Category id cannot be empty" })
            }
            if(!org_id){
                return res.status(400).json({status:"failure", message: "Organization id cannot be empty" })
            }
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
                const data = await Division.create({
                    div_name: div_name,
                    div_no: div_no,
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
            try{
                if (errorMessages.includes('email must be unique'))
                    {
                        const Data = await db.sequelize.query(`
                            SELECT deletedAt FROM divisionDetails
                            WHERE divisionDetails.email = ? ;
                            `, { 
                            type: Sequelize.QueryTypes.SELECT,
                            replacements : [req.body.email]
                        });
                        console.log("deleted data",Data[0].deletedAt);
                        
                        if(Data[0].deletedAt == null){
                            // beacon is already in table
                            return res.status(400).json({ status: "failure", message: "Email address already in use" });
                        };
                        const revokeData = await db.sequelize.query(`
                            UPDATE beaconDB.divisionDetails 
                            SET div_name = ?,div_no=?,category=?,contact_number=?,org_id=?,
                            createdAt = CURRENT_TIMESTAMP(), deletedAt = null
                             WHERE email = ?;
                            `, { 
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements : [req.body.div_name,req.body.div_no,req.body.category,req.body.contact_number,req.body.org_id,req.body.email,]
                        });
                        console.log("revoke data" ,revokeData[0]);
                        if(revokeData[1] > 0){
                            return res.status(200).json({ status: "success", message: "Division Created successfully" });
                        }
                    };
                return res.status(400).json({ status: "failure", message: errorMessages });
            } catch(e) {
                console.log(e.message);
                return res.status(400).json({ status: "failure", message: "something went wrong" });
            }
        }
        console.log(error);
        
        return res.status(500).json({ status: "failure", message: "Internal Server Error"})
    }

}
const getAlldivisions = async (req, res) => {
    try {
        const data = await Division.findAll({
            attributes: ['div_id', 'div_name', 'div_no', 'contact_number', 'email'],
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
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}
const getSingleDivision = async (req, res) => {
    try {
        const division = await Division.findOne({
            attributes: ['div_id', 'div_name', 'div_no', 'contact_number', 'email'],
            where: {
                div_id: req.params.id
            }
        })
        if (division) {
            res.status(200).json({ status: "success", data: division })
        }
        else {
            res.status(200).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}
const updateDivision = async (req, res) => {
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
                            const [affectedRow] = await Division.update(req.body, {
                                where: {
                                    div_id: req.params.id
                                }
                            })
                            if (affectedRow === 1) {
                                res.status(200).json({ status: "success", message: "Updated successfully" })
                            }
                            else {
                                res.status(200).json({ status: "failure", message: "Record not found" })
                            }
                        }
                    }else{
                        const [affectedRow] = await Division.update(req.body, {
                            where: {
                                div_id: req.params.id
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
                const [affectedRow] = await Division.update(req.body, {
                    where: {
                        div_id: req.params.id
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
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            return res.status(400).json({ status: "failure", message: errorMessages})
        }
        return  res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}
const deleteDivision = async (req, res) => {
    try {
        const affectedRow = await Division.destroy({
            where: {
                div_id: req.params.id
            }
        })
        if (affectedRow === 1) {
            await Beacon.destroy({
                where: {
                    div_id: req.params.id
                }
            })
            res.status(200).json({ status: "success", message: "Deleted successfully" })
        }
        else {
            res.status(404).json({ status: "failure", message: "Record not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}
const DivisionLogin = async (req, res) => {
    try {
        const data = await Division.findOne({
            attributes: ['email', 'password_hash', 'org_id', 'div_name', 'div_id'],
            where: { email: req.body.email }
        });
        if (data) {
            const password = data.password_hash
            const matchedPassword = await argon2.verify(password, req.body.password)
            if (matchedPassword) {
                const tokenPayload = {
                    org_id: data.org_id,
                    div_id: data.div_id,
                    div_name: data.div_name
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
const getDivBeacon = async (req, res) => {
    try {
        const divBeacons = await Beacon.findAll({
            attributes: ["beacon_id","beacon_name", "mac"],
            where: {
                div_id: req.params.id
            }
        })
        if (divBeacons.length !== 0) {
            res.status(200).json({ status: "success", data: divBeacons })
        } else {
            res.status(200).json({ status: "failure", data:divBeacons })
        }
    } catch (e) { res.status(500).json({ status: "failure", message: "Internal Server Error" }); }
}
const divNotification = async (req, res) => {
    try {
        const { div_id, hourTime,description } = req.body;

        const query = `
            SELECT DISTINCT DeviceFcmTokens.fcm_token 
            FROM BeaconVisited,DeviceFcmTokens
            WHERE beacon_mac IN (SELECT mac FROM Beacons WHERE div_id = ?)
            AND BeaconVisited.createdAt > (CURDATE() - INTERVAL ? HOUR)
            AND DeviceFcmTokens.device_id = BeaconVisited.device_id
            ORDER BY BeaconVisited.createdAt DESC;
        `;

        const replacements = [div_id, hourTime];

        const divUsers = await db.sequelize.query(query, {
            type: Sequelize.QueryTypes.SELECT,
            replacements
        });

        if (divUsers.length === 0) {
            return res.status(404).json({ status: "Not found", message: "No users connected in this time interval" });
        }

        const divDetail = await db.sequelize.query(
           `SELECT div_name,div_no,divisionDetails.contact_number,org_name,address
            FROM OrganizationDetails,divisionDetails
            WHERE divisionDetails.org_id =OrganizationDetails.org_id 
            AND divisionDetails.div_id = ? `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [div_id]
            }
        );

        const { contact_number, div_name, div_no, org_name, address } = divDetail[0];

        const notification = `Dear Customer,Notification description here... ${description} Just dial: ${contact_number}  Go to: ${div_name}, ${div_no}, ${org_name}, ${address}`;

        return res.status(200).json({ 
            status: "success", 
            Notification: notification, 
            deviceUniqueIDs: divUsers 
        });

    } catch (e) {
        return res.status(500).json({ status: "failure", message: "Internal Server Error"});
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
        const orgBeacondivWise = await db.sequelize.query(`
            SELECT divisionDetails.div_id AS div_ID,
            divisionDetails.div_name AS division,
            (SELECT COUNT(*) FROM Beacons 
            WHERE Beacons.div_id = divisionDetails.div_id
            AND Beacons.deletedAt IS NULL) AS beacons_in_division,
            Beacons.beacon_id, Beacons.beacon_name FROM divisionDetails
            JOIN Beacons ON Beacons.div_id = divisionDetails.div_id
            WHERE divisionDetails.org_id = ?
            AND Beacons.deletedAt IS NULL
            GROUP BY divisionDetails.div_id,
            divisionDetails.div_name,
            Beacons.beacon_id,
            Beacons.beacon_name
            ORDER BY divisionDetails.div_id,
            Beacons.beacon_name;
        `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements : [req.params.id]
            })
        if (orgBeacondivWise) {
            return res.status(200).json({ status: "success", data: orgBeacondivWise })
        } else {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}


module.exports = {
    createDivision,
    getAlldivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
    DivisionLogin,
    getDivBeacon,
    divNotification,
    getAllBeaconDivisionWise
}