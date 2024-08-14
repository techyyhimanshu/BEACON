const db = require("../models")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const Organization = db.Organization
const Shop = db.Shop
const Beacon = db.Beacon
const Template = db.template
const TemplateType = db.temptype

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
            attributes: ['shop_id','shop_name', 'shop_no'],
            where: {
                org_id: req.body.org_id
            },
            include: [{
                model: db.Category,
                attributes: ['category_name']
            }]
        })
        //const catName = data[0].dataValues.Category.category_name
        // const shops = data.map(shop => ({
        //     shop_name: shop.dataValues.shop_name,
        //     shop_no: shop.dataValues.shop_no,
        //     category: catName
        // }));
        console.log(data);
        
        if (data.length===0) {
            // if(data.length==0)
            // {
                res.status(200).json({ status: "failure", data: "organization not found" })
            // }
        }
        else {
            res.status(200).json({ status: "success", data: data })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failure" });
    }

}


// get beacon url
function getDifference(date_1, date_2) {
    let date1 = new Date(date_1);
    let date2 = new Date(date_2);

    // Calculate the time difference between two dates in milliseconds
    let differenceInTime = date2.getTime() - date1.getTime();

    // Convert the time difference from milliseconds to days
    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    // console.log("Day difference is " + differenceInDays);
    return differenceInDays;
}

// Function to find the URL for a beacon based on its MAC address
async function findUrl(macAddress) {
    
    try {
        // Find the beacon data by its MAC address
        console.log("find url call");
        console.log(macAddress);
        
    
        const beaconData = await Beacon.findOne({
            attributes: ["template_id"],
            where: { mac: macAddress },
            include: {
                model: Shop,
                attributes: ["org_id"]
            }
        });
        console.log("beacon data");
        
        console.log(beaconData);

        // If beacon data is found, proceed to find the associated template
        if (beaconData) {
            console.log("beacon data found");

            const templateData = await Template.findOne({
                where: {
                    template_id: beaconData.template_id
                }
            })
            // If template data is found, check if the offer is valid today
            if (templateData) {
                let today = new Date();
                const beforeTime = getDifference(templateData.get("valid_from"), today);
                const afterTime = getDifference(today, templateData.get("valid_till"));

                // console.log("Before time: " + beforeTime + " - After time: " + afterTime);

                // Check if the current date falls within the validity period of the offer
                if (beforeTime >= 0 && afterTime > 0) {
                    // console.log("Offer is valid today");

                    // Find the template type data to construct the URL
                    const templateTypeData = await TemplateType.findOne({
                        attributes: ['template_path'],
                        where: { templateType_id: templateData.templateType_id }
                    });
                    var launchUrl = "";
                    const staticPath = templateTypeData.template_path + "?orgId=" + beaconData.ShopDetail.dataValues.org_id
                    // if(staticPath[staticPath.length -1]!='/')
                    // {
                    //     staticPath = staticPath + '/';
                    // }
                    // console.log("url path end point = "+staticPath[staticPath.length -1]);
                    // console.log("offer data 2 = " + templateData.get('offer_data_2'));

                    // Construct the URL using the template path and offer data
                    //console.log(staticPath);
                    
                    var launchUrlOrg = {}
                    if (staticPath) {
                        if (templateData.offer_data_1 && templateData.offer_data_2) {
                            launchUrl = staticPath + '&&offertext=' + templateData.offer_data_1 + '&&offerdata=' + templateData.offer_data_2;

                        } else if (templateData.offer_data_1) {
                            launchUrl = staticPath + '&&offertext=' + templateData.offer_data_1;
                        } else if (templateData.offer_data_2) {
                            launchUrl = staticPath + '&&offerdata=' + templateData.offer_data_2;
                        } else {
                            launchUrl = staticPath;
                        }                                                
                    }
                    launchUrlOrg = {
                        url: launchUrl,
                        org_id: beaconData.ShopDetail.dataValues.org_id
                    }
                    //console.log(launchUrlOrg);
                    
                    return launchUrlOrg;
                } else {
                    // Return a message if there is no valid offer today
                    return "Offer exprired ----- There is no offer valid today.";
                }
            } else {
                // Return a message if template data is not found
                return "Sorry! Template data is not found.";
            }
        } else {
            // Return a message if beacon data is not found
            return "Sorry! Beacon data is not found.";
        }
    } catch (e) {
        // Return an error message if an exception occurs
        return "Error occurred: " + e.message;
    }
}

// // Function to handle login and find the URL for a beacon
// const login = async (req, res) => {
//     try {
//         // Find the beacon data by its MAC address
//         const data = await Beacon.findOne({
//             where: { mac: req.body.mac }
//         });

//         // If beacon data is found, find the associated URL
//         if (data) {
//             const {url,org_id} = await findUrl(req.body.mac);
//             const visitedData = beaconVisited(req.body)
//             //console.log(visitedData);

//             if (visitedData) {
//                 res.status(200).json({ status: "success", url: url || "https://www.google.com", org_id: org_id });
//             } else {
//                 res.status(200).json({ status: "failure", message: "Error Occured" });
//             }
//             // Send the URL as part of the response, defaulting to Google if no URL is built
//         } else {
//             // Return a message if the beacon is not added yet
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

const getOrganizationBeacons2 = async (req, res) => {
    try {
        const orgBeacons = await db.sequelize.query(`
            select beacon_id,beacon_name,mac 
            from beaconDB.Beacons 
            where shop_id in
            (select shop_id 
            from beaconDB.ShopDetails 
            where org_id=?)`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.params.id]
            });

            //console.log(orgBeacons);

            var orgBeaconsData = [];

            async function processBeacons(orgBeacons) {
                const beaconPromises = orgBeacons.map(async beacon => {
                    const { url, org_id } = await findUrl(beacon.mac);
                    return { ...beacon, orgId: org_id, url: url };
                });
            
                orgBeaconsData = await Promise.all(beaconPromises);
                return orgBeaconsData
            }
            
            // Call the function with your orgBeacons array
            console.log("out of loop");
            
            processBeacons(orgBeacons).then(data => {
                if (data.length !== 0) {
                    res.status(200).json({ status: "success", data: data })
                } else {
                    res.status(404).json({ status: "Not found", message: "no beacon added to this org" })
                }
            });
    } catch (e) { 
        res.status(400).json({ status: "failure", message: e.message }); }
}


const getOrganizationBeacons = async (req,res) => {
    try{
        const buildUrl = await db.sequelize.query(`
            SELECT
                Beacons.beacon_id,
                Beacons.mac,
                Beacons.beacon_name,
                CASE 
                    WHEN datediff(CURDATE(),templates.valid_from) > 0  AND datediff(templates.valid_till,CURDATE()) > 0
                    THEN
                        CASE
                            WHEN ((templates.offer_data_1!= "" OR templates.offer_data_1 != NULL) AND (templates.offer_data_2!= "" OR templates.offer_data_2 != NULL)) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offertext=" ,templates.offer_data_1,"&&offerdata=",templates.offer_data_2)
                            WHEN (templates.offer_data_1!= "" OR templates.offer_data_1 != NULL) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offertext=",templates.offer_data_1)
                            WHEN (templates.offer_data_2!= "" OR templates.offer_data_2 != NULL) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offerdata=",templates.offer_data_2)
                        ELSE CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id)
                        END 
                    ELSE 'OFFER NOT VALID'
                END as URL
            FROM beaconDB.ShopDetails,beaconDB.Beacons,beaconDB.templates,beaconDB.tempTypes
            WHERE ShopDetails.org_id= ?
            AND Beacons.shop_id = ShopDetails.shop_id
            AND Beacons.template_id = templates.template_id
            AND tempTypes.templateType_id = templates.templateType_id;`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.params.id]
            });

            if(buildUrl)
            {
                res.status(200).json({ status: "success", data: buildUrl })
            }
            else{
                res.status(404).json({ status: "failure", message: "technical issue in url fetching" })
            }
    }
    catch(e){
        res.status(404).json({ status: "failure", message: e.message })
    }
}


const getOrganizationMenu = async (req,res) => {
    try{
        const buildUrl = await db.sequelize.query(`
            SELECT
                BeaconTemplates.parent,
                BeaconTemplates.alias,
                templates.template_id,
                CASE 
                    WHEN datediff(CURDATE(),templates.valid_from) > 0  AND datediff(templates.valid_till,CURDATE()) > 0
                    THEN
                        CASE
                            WHEN ((templates.offer_data_1!= "" OR templates.offer_data_1 != NULL) AND (templates.offer_data_2!= "" OR templates.offer_data_2 != NULL)) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offertext=" ,templates.offer_data_1,"&&offerdata=",templates.offer_data_2)
                            WHEN (templates.offer_data_1!= "" OR templates.offer_data_1 != NULL) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offertext=",templates.offer_data_1)
                            WHEN (templates.offer_data_2!= "" OR templates.offer_data_2 != NULL) 
                            THEN CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id,"&&offerdata=",templates.offer_data_2)
                        ELSE CONCAT(tempTypes.template_path,"?orgId=",ShopDetails.org_id)
                        END 
                    ELSE 'www.google.com'
                END as URL
            FROM beaconDB.ShopDetails,beaconDB.Beacons,beaconDB.templates,beaconDB.tempTypes,beaconDB.BeaconTemplates
            WHERE ShopDetails.org_id= ?
            AND Beacons.shop_id = ShopDetails.shop_id
            AND BeaconTemplates.beacon_id = Beacons.beacon_id
            AND templates.template_id = BeaconTemplates.template_id
            AND tempTypes.templateType_id = templates.templateType_id
            order by Beacons.beacon_id,BeaconTemplates.parent;`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.params.id]
            });

            if(buildUrl)
            {
                res.status(200).json({ status: "success", data: buildUrl })
            }
            else{
                res.status(404).json({ status: "failure", message: "technical issue in url fetching" })
            }
    }
    catch(e){
        res.status(404).json({ status: "failure", message: e.message })
    }
}


module.exports = {
    createOrganization,
    getAllOrganization,
    getSingleOrganization,
    updateOrganization,
    deleteOrganization,
    getShopsByOrganization,
    getOrganizationBeacons,
    getOrganizationMenu
}