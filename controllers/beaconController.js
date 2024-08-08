const db = require("../models");
const Beacon = db.Beacon;
const Shop = db.Shop;
const Template = db.template;
const TemplateType = db.temptype;
const BeaconVisited = db.BeaconVisited;

const Sequelize = require("sequelize");
const beacon = require("../models/beacon");
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
            console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};
const getAllBeacons = async (req, res) => {

    try {
        if (req.username === 'cit_superadmin') {
            const beacons = await Beacon.findAll({
                attributes: ['beacon_id', 'beacon_name', 'mac'],
                include: [{
                    model: Shop,
                    attributes: ['shop_id', 'shop_name']
                }, {
                    model: Template,
                    attributes: ['template_id'],
                    include: [{
                        model: TemplateType,
                        attributes: ['template_path']
                    }]
                }]
            })
            if (beacons) {
                res.status(200).json({ status: "success", data: beacons })
            } else {
                res.status(404).json({ status: "failure", message: "Not found" })
            }
        } else {
            res.status(403).json({ status: "failure", message: "Unauthorized" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}
const getBeaconsList = async (req, res) => {

    try {
        const beacons = await Beacon.findAll({
            attributes: ['beacon_id', 'beacon_name', 'mac', 'beacon_org'],
        })
        if (beacons) {
            res.status(200).json({ status: "success", data: beacons })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}
// Function to calculate the difference in days between two dates
function getDifference(date_1, date_2) {
    let date1 = new Date(date_1);
    let date2 = new Date(date_2);

    // Calculate the time difference between two dates in milliseconds
    let differenceInTime = date2.getTime() - date1.getTime();

    // Convert the time difference from milliseconds to days
    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    console.log("Day difference is " + differenceInDays);
    return differenceInDays;
}

// Function to find the URL for a beacon based on its MAC address
async function findUrl(macAddress) {
    try {
        // Find the beacon data by its MAC address
        const beaconData = await Beacon.findOne({
            attributes: ["template_id"],
            where: { mac: macAddress }
        });
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

                console.log("Before time: " + beforeTime + " - After time: " + afterTime);

                // Check if the current date falls within the validity period of the offer
                if (beforeTime >= 0 && afterTime > 0) {
                    console.log("Offer is valid today");

                    // Find the template type data to construct the URL
                    const templateTypeData = await TemplateType.findOne({
                        attributes: ['template_path'],
                        where: { templateType_id: templateData.templateType_id }
                    });
                    var launchUrl = "";
                    const staticPath = templateTypeData.template_path
                    // if(staticPath[staticPath.length -1]!='/')
                    // {
                    //     staticPath = staticPath + '/';
                    // }
                    // console.log("url path end point = "+staticPath[staticPath.length -1]);
                    console.log("offer data 2 = " + templateData.get('offer_data_2'));

                    // Construct the URL using the template path and offer data
                    if (staticPath) {
                        if (templateData.offer_data_1 && templateData.offer_data_2) {
                            launchUrl = staticPath + '?offertext=' + templateData.offer_data_1 + '&&offerdata=' + templateData.offer_data_2;
                        } else if (templateData.offer_data_1) {
                            launchUrl = staticPath + '?offertext=' + templateData.offer_data_1;
                        } else if (templateData.offer_data_2) {
                            launchUrl = staticPath + '?offerdata=' + templateData.offer_data_2;
                        } else {
                            launchUrl = staticPath;
                        }
                    }
                    console.log("URL built for beacon: " + launchUrl);
                    return launchUrl;
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

// Function to handle login and find the URL for a beacon
const login = async (req, res) => {
    try {
        // Find the beacon data by its MAC address
        const data = await Beacon.findOne({
            where: { mac: req.body.mac }
        });

        // If beacon data is found, find the associated URL
        if (data) {
            const builtUrl = await findUrl(req.body.mac);
            const visitedData = beaconVisited(req.body)
            if (visitedData) {
                res.status(200).json({ status: "success", url: builtUrl || "https://www.google.com" });
            } else {
                res.status(200).json({ status: "failure", message: "Error Occured" });
            }
            // Send the URL as part of the response, defaulting to Google if no URL is built
        } else {
            // Return a message if the beacon is not added yet
            res.status(200).json({ status: "beacon is not added yet" });
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
            console.log(error);
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
};

// Function to get single beacon by id
const getSingleBeacon = async (req, res) => {
    try {
        // Retrieve the beacon by its primary key (beacon_id) from the request body
        console.log(req.params.id);

        const beaconData = await Beacon.findByPk(req.params.id, {
            attributes: ['beacon_id', 'mac', 'beacon_name'],
            include: [{
                model: Shop,
                attributes: ['shop_name']
            }, {

                model: Template,
                attributes: ['templateType_id', 'valid_from', 'valid_till', 'offer_data_1', 'offer_data_2']
            }]
        });

        // If the beacon is not found, return a 404 error response
        if (!beaconData) {
            return res.status(404).json({ status: "failure", message: "Beacon not found" });
        }
        // If the beacon is fatch successfully, return a success response
        else {
            res.status(200).json({ status: "success", message: "Updated successfully", data: beaconData });
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
const beaconVisited = async (data) => {
    try {
        const data2 = await BeaconVisited.create({
            beacon_mac: data.mac,
            user_mac: data.user_mac,
            location: data.location
        })
        if (data2) {
            return data2
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

const getDevicesOfBeacons = async (req, res) => {
    try {
        const count = await BeaconVisited.count({
            where:{
                beacon_mac:req.body.mac
            }
        })
        const devices = await BeaconVisited.findAll({
            where:{
                beacon_mac:req.body.mac
            },
            order:[["createdAt","DESC"]]
        })
        if (count!==0 &&devices.length!==0) {
            res.status(200).json({ status: "success", count: count,data:devices });
        } else {
            res.status(404).json({ status: "failure", message: "Not found" });
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" });
    }
}


// Exporting the functions to be used in other files
module.exports = {
    addBeacon,
    login,
    updateBeacon,
    getAllBeacons,
    getSingleBeacon,
    getBeaconsList,
    beaconVisited,
    getDevicesOfBeacons
};
