const db = require("../models");
const Beacon = db.Beacon;
const Shop = db.Shop;
const Template = db.template;
const TemplateType = db.temptype;
const BeaconVisited = db.BeaconVisited;
const User = db.user;
const DeviceFcmToken = db.DeviceFcmToken;
const tbl_template = db.tbl_template;


const admin = require("../config/firebase");

const Sequelize = require("sequelize");
// const beacon = require("../models/beacon");
// const appclass = require("../appClass");

// Function to add a new beacon
const addBeacon = async (req, res) => {
    try {
        // Retrieve the shop by its primary key (shop_id) from the request body
        const shop = await Shop.findByPk(req.body.shop_id);

        // If the shop is not found, return a 404 error response
        if (!shop) {
            return res.status(404).json({ status: "failure", message: "Shop not found" });
        }

        // Create a new beacon entry using the data from the request body
        const data = await Beacon.create({
            beacon_name: req.body.beacon_name,
            mac: req.body.mac,
            shop_id: req.body.shop_id,
        });

        // If the beacon is created successfully, return a success response
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" });
        }
        else {
            res.status(404).json({ status: "failure", message: "Not Created successfully" });

        }
    } catch (error) {
        // Handle Sequelize validation errors
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            // Log any other errors and return a 500 internal server error response
            // console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};

const getAllBeacons = async (req, res) => {

    try {
            const rows = await db.sequelize.query(`SELECT 
                Beacons.beacon_id,
                Beacons.beacon_name,
                Beacons.mac,
                COUNT(BeaconVisited.beacon_mac) as connectedUsers,
                Beacons.shop_id AS div_Id,
                ShopDetails.shop_name as div_name,
                COALESCE(OrganizationDetails.org_id, 'NOT LINKED' ) as org_id,
                COALESCE(OrganizationDetails.org_name, 'NOT LINKED') as org_name,
                Beacons.template_id,
                COALESCE(tbl_templates.template_name, 'NO NAME ASIGN') as template_name
            FROM 
                beaconDB.Beacons
            LEFT JOIN 
                beaconDB.ShopDetails ON Beacons.shop_id = ShopDetails.shop_id
            LEFT JOIN 
                beaconDB.OrganizationDetails ON ShopDetails.org_id = OrganizationDetails.org_id
            LEFT JOIN 
                tbl_templates ON Beacons.template_id = tbl_templates.temp_id
            LEFT JOIN 
                beaconDB.BeaconVisited ON BeaconVisited.beacon_mac = Beacons.mac
            GROUP BY 
                Beacons.beacon_id,
                Beacons.shop_id,
                OrganizationDetails.org_id;
            `, {
                type: Sequelize.QueryTypes.SELECT
            });
            const count = await db.sequelize.query(`select count(beacon_id) AS COUNT from Beacons;`, {
                type: Sequelize.QueryTypes.SELECT
            });
                 
            if (rows) {
                res.status(200).json({ status: "success", count: count[0].COUNT, data: rows })
            } else {
                res.status(404).json({ status: "failure", message: "Not found" })
            }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}

const getBeaconsList = async (req, res) => {

    try {
        const { count, rows } = await Beacon.findAndCountAll({
            attributes: ['beacon_id', 'beacon_name', 'mac', 'beacon_org'],
        })
        //console.log(rows,count);

        if (rows) {
            const countRows = {
                count,
                rows
            }
            res.status(200).json({ status: "success", data: countRows })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}
// // old code
// function getDifference(date_1, date_2) {
//     let date1 = new Date(date_1);
//     let date2 = new Date(date_2);

//     // Calculate the time difference between two dates in milliseconds
//     let differenceInTime = date2.getTime() - date1.getTime();

//     // Convert the time difference from milliseconds to days
//     let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

//     // console.log("Day difference is " + differenceInDays);
//     return differenceInDays;
// }

// Function to find the URL for a beacon based on its MAC address
// async function findUrl(macAddress) {
//     try {
//         // Find the beacon data by its MAC address
//         const beaconData = await Beacon.findOne({
//             attributes: ["template_id"],
//             where: { mac: macAddress },
//             include: {
//                 model: Shop,
//                 attributes: ["org_id"]
//             }
//         });
//         console.log(beaconData.ShopDetail.dataValues.org_id);

//         // If beacon data is found, proceed to find the associated template
//         if (beaconData) {
//             // console.log("beacon data found");

//             const templateData = await Template.findOne({
//                 where: {
//                     template_id: beaconData.template_id
//                 }
//             })
//             // If template data is found, check if the offer is valid today
//             if (templateData) {
//                 let today = new Date();
//                 const beforeTime = getDifference(templateData.get("valid_from"), today);
//                 const afterTime = getDifference(today, templateData.get("valid_till"));

//                 // console.log("Before time: " + beforeTime + " - After time: " + afterTime);

//                 // Check if the current date falls within the validity period of the offer
//                 if (beforeTime >= 0 && afterTime > 0) {
//                     // console.log("Offer is valid today");

//                     // Find the template type data to construct the URL
//                     const templateTypeData = await TemplateType.findOne({
//                         attributes: ['template_path'],
//                         where: { templateType_id: templateData.templateType_id }
//                     });
//                     var launchUrl = "";
//                     const staticPath = templateTypeData.template_path + "?orgId=" + beaconData.ShopDetail.dataValues.org_id
//                     // if(staticPath[staticPath.length -1]!='/')
//                     // {
//                     //     staticPath = staticPath + '/';
//                     // }
//                     // console.log("url path end point = "+staticPath[staticPath.length -1]);
//                     // console.log("offer data 2 = " + templateData.get('offer_data_2'));

//                     // Construct the URL using the template path and offer data
//                     console.log(staticPath);

//                     var launchUrlOrg = {}
//                     if (staticPath) {
//                         if (templateData.offer_data_1 && templateData.offer_data_2) {
//                             launchUrl = staticPath + '&&offertext=' + templateData.offer_data_1 + '&&offerdata=' + templateData.offer_data_2;

//                         } else if (templateData.offer_data_1) {
//                             launchUrl = staticPath + '&&offertext=' + templateData.offer_data_1;
//                         } else if (templateData.offer_data_2) {
//                             launchUrl = staticPath + '&&offerdata=' + templateData.offer_data_2;
//                         } else {
//                             launchUrl = staticPath;
//                         }
//                     }
//                     launchUrlOrg = {
//                         url: launchUrl,
//                         org_id: beaconData.ShopDetail.dataValues.org_id
//                     }
//                     return launchUrlOrg;
//                 } else {
//                     // Return a message if there is no valid offer today
//                     return "Offer exprired ----- There is no offer valid today.";
//                 }
//             } else {
//                 // Return a message if template data is not found
//                 return "Sorry! Template data is not found.";
//             }
//         } else {
//             // Return a message if beacon data is not found
//             return "Sorry! Beacon data is not found.";
//         }
//     } catch (e) {
//         // Return an error message if an exception occurs
//         return "Error occurred: " + e.message;
//     }
// }

// Function to handle login and find the URL for a beacon
// const login = async (req, res) => {
//     //#region 
//     // try {
//     //     const data = await Beacon.findOne({
//     //         attributes: ["beacon_id"],
//     //         where: { mac: req.body.mac }
//     //     });
//     //     if (data) {
//     //         const visitedData = await beaconVisited(req.body)
//     //         const beaconTemplateData = await BeaconTemplate.findAll({
//     //             attributes: ["alias","is_main"],
//     //             where: {
//     //                 beacon_id: data.beacon_id
//     //             },
//     //             include:[{
//     //                 model:Template,
//     //                 attributes:['templateType_id'],
//     //                 include:[{
//     //                     model:TemplateType,
//     //                     attributes:['template_path']
//     //                 }]
//     //             }]
//     //         })            
//     //         res.status(200).json({ status: "success", data:beaconTemplateData })
//     //     } else {
//     //         res.status(404).json({ status: "failure", message: "Beacon not found" })
//     //     }
//     // } catch (error) {
//     //     console.log(error.message);

//     // }
//     //#endregion

//     try {
//         const data = await Beacon.findOne({
//             where: { mac: req.body.mac }
//         });
//         if (data) {
//             const { url, org_id } = await findUrl(req.body.mac);
//             const visitedData = await beaconVisited(req.body)
//             const userFcm=await DeviceFcmToken.findOne({
//                 attributes:["fcm_token"],
//                 where:{
//                     device_id:req.body.user_mac
//                 }
//             })            
//             if (visitedData) {
//                 await sendMessageToUser(userFcm.fcm_token, 'Welcome to Our Beacon Zone!"', "Hi there! You've entered our beacon zone. Tap here to unlock your exclusive offer before it’s gone!");
//                 return res.status(200).json({ status: "success", url: url || "https://www.google.com", org_id: org_id });
//             }
//             return res.status(500).json({ status: "failure", message: "Error occured" });
//         } else {
//             res.status(200).json({ status: "beacon is not added yet" });
//         }
//     } catch (error) {
//         // Handle Sequelize validation errors
//         if (error instanceof Sequelize.ValidationError) {
//             const errorMessages = error.errors.map(err => err.message);
//             res.status(400).json({ status: "failure", message: errorMessages });
//         } else {
//             // Log any other errors and return a 500 internal server error response
//             console.log(error);
//             res.status(500).json({ status: "failure", message: "Internal Server Error" });
//         }
//     }
// };

// Function to update old beacon


const updateBeacon = async (req, res) => {
    try {
        // Retrieve the beacon by its primary key (beacon_id) from the request body
        const beaconData = await Beacon.findByPk(req.body.beacon_id);

        // If the shop is not found, return a 404 error response
        if (!beaconData) {
            return res.status(404).json({ status: "failure", message: "Beacon not found" });
        }
        // Retrieve the shop by its primary key (shop_id) from the request body
        const shopData = await Shop.findByPk(req.body.shop_id);
        if (!shopData) {
            return res.status(404).json({ status: "failure", message: "Shop not found" });
        }

        // Create a new beacon entry using the data from the request body
        const data = await Beacon.update({
            beacon_name: req.body.beacon_name,
            shop_id: req.body.shop_id,
        }, {
            where: {
                beacon_id: req.body.beacon_id
            }
        }
        );

        // If the beacon is created successfully, return a success response
        if (data) {
            res.status(200).json({ status: "success", message: "Updated successfully", data: data });
        }
        else {
            res.status(200).json({ status: "failure", message: "Something went wrong !!! beacon not updated successfully" });
        }
    } catch (error) {
        // Handle Sequelize validation errors
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            // Log any other errors and return a 500 internal server error response
            //console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};

// DELETE BEACON 
const deleteBeacon = async (req, res) => {
    try {
        // Retrieve the beacon by its primary key (beacon_id) from the request body
        const beaconData = await Beacon.findByPk(req.params.id);

        // If the shop is not found, return a 404 error response
        if (!beaconData) {
            return res.status(404).json({ status: "failure", message: "Beacon not found" });
        }
        // DELETE BEACON
        const data = await Beacon.destroy({
            where: {
                beacon_id: req.params.id
            }
        }
        );

        // If the beacon is created successfully, return a success response
        if (data > 0) {
            res.status(200).json({ status: "success", message: "DELETED successfully" });
        }
        else {
            res.status(200).json({ status: "failure", message: "Something went wrong !!! beacon not DELETED successfully" });
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
        console.log(error.message);
    }
};
// Function to get single beacon by id
const getSingleBeacon = async (req, res) => {
    try {
        const rows = await db.sequelize.query(`SELECT 
            Beacons.beacon_id,
            Beacons.beacon_name,
            Beacons.mac,
            COUNT(BeaconVisited.beacon_mac) as connectedUsers,
            Beacons.shop_id AS div_Id,
            ShopDetails.shop_name as div_name,
            COALESCE(OrganizationDetails.org_id, NULL) as org_id,
            COALESCE(OrganizationDetails.org_name, NULL) as org_name,
            Beacons.template_id,
            COALESCE(tbl_templates.template_name, NULL) as template_name
        FROM 
            beaconDB.Beacons
        LEFT JOIN 
            beaconDB.ShopDetails ON Beacons.shop_id = ShopDetails.shop_id
        LEFT JOIN 
            beaconDB.OrganizationDetails ON ShopDetails.org_id = OrganizationDetails.org_id
        LEFT JOIN 
            tbl_templates ON Beacons.template_id = tbl_templates.temp_id
        LEFT JOIN 
            beaconDB.BeaconVisited ON BeaconVisited.beacon_mac = Beacons.mac
        WHERE 
            Beacons.beacon_id = ?
        GROUP BY 
            Beacons.beacon_id,
            Beacons.shop_id,
            OrganizationDetails.org_id;
        `, {
            type: Sequelize.QueryTypes.SELECT,
            replacements : [req.params.id]
        });
        if (rows.length > 0 ) {
            res.status(200).json({ status: "success", data: rows })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
} catch (error) {
        // Handle Sequelize validation errors
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            // Log any other errors and return a 500 internal server error response
            //console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};

const beaconVisited = async (data) => {
    try {
        const data2 = await BeaconVisited.create({
            beacon_mac: data.mac,
            user_mac: data.user_mac,
            location: data.location
        })
        return data2;
    } catch (error) {
        console.log(error);
        return null
    }
}

// const createFcmTokenEntry = async (user_mac, fcm_token) => {
//     try {
//         const userFcm=await DeviceFcmToken.findOne({
//             attributes:["fcm_token"],
//             where:{
//                 device_id:user_mac
//             }
//         })
        
//         if(userFcm===null||!userFcm || userFcm.fcm_token.length===0){
//             const data = await DeviceFcmToken.create({
//                 device_id: user_mac,
//                 fcm_token: fcm_token
//             })
    
//             if (!data) {
//                 return false
//             }
//             return true
//         }
//         if(userFcm.fcm_token===fcm_token){
//             return true
//         }
//         const fcmUpdate = await DeviceFcmToken.update({
//             fcm_token:fcm_token
//         },{
//             where:{
//                 device_id:user_mac
//             }
//         })
//         if(!fcmUpdate){
//             return false
//         }
//         return true
//     } catch (error) {
//         console.log(error);
//         return false
//     }
// }
const sendMessageToUser = async (token, title, body) => {
    try {
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };
    
        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } catch (error) {
        console.log(error.message);
        
    }
};
// Exporting the functions to be used in other files
module.exports = {
    addBeacon,
    // login,
    updateBeacon,
    getAllBeacons,
    getSingleBeacon,
    getBeaconsList,
    beaconVisited,
    deleteBeacon
};
