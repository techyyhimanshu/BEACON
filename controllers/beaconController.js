const db = require("../models");
const Beacon = db.Beacon;
const Shop = db.Shop;
const Template = db.template;
const TemplateType = db.temptype;

const Sequelize = require("sequelize");
const appclass = require("../appClass");

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
        const data = await Beacon.create(req.body);
        
        // If the beacon is created successfully, return a success response
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" });
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
            const templateData = await Template.findOne({
                attributes: ['valid_from', 'valid_till', 'templateType_id', 'offer_data_1', 'offer_data_2'],
                where: {
                    template_id: beaconData.template_id,
                    deletedAt: null
                }
            });

            console.log("Template data is: " + templateData.get("valid_from"));

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

                    // Construct the URL using the template path and offer data
                    const launchUrl = templateTypeData.template_path + templateData.offer_data_1 + '/' + templateData.offer_data_2;
                    console.log("URL built for beacon: " + launchUrl);
                    return launchUrl;
                } else {
                    // Return a message if there is no valid offer today
                    return "There is no offer valid today.";
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

            // Send the URL as part of the response, defaulting to Google if no URL is built
            res.status(200).json({ status: "success", url: builtUrl || "https://www.google.com" });
        } else {
            // Return a message if the beacon is not added yet
            res.status(200).json({ status: "beacon is not added yet", url: "https://www.google.com" });
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

// Exporting the functions to be used in other files
module.exports = {
    addBeacon,
    login
};
