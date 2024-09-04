const db = require("../models");
const Sequelize = require('sequelize');
const tbl_template = require("../models/tbl_template");
const TempButton = db.tbl_temp_button;
const TempContent = db.tbl_temp_content;
const TempSubMenu = db.tbl_temp_menu;
const Template = db.tbl_template;
const Beacon = db.Beacon;
const BeaconVisited = db.BeaconVisited;
const User = db.user;
const TempLikes = db.tbl_temp_like;


const beaconFire = async (req, res) => {
    try {
        // Fetch the beacon with the associated template_id based on the provided MAC address
        const beacon = await Beacon.findOne({
            attributes: ['template_id'],
            where: { mac: req.body.mac }
        });

        if (beacon) {
            if (beacon.template_id) {
                // If the beacon has a template_id, proceed with further operations
                req.body.temp_id = beacon.template_id;

                // Process beaconVisited in the background without waiting for it to complete
                await beaconVisited(req.body);

                // Fetch the user's like/dislike status for the template associated with the beacon
                const tempLikeData = await TempLikes.findOne({
                    attributes: ['status'],
                    where: { user_uniqueID: req.body.device_uniqueID, temp_id: beacon.template_id }
                });

                // Initialize likeData with default values
                let likeData = { liked: 0, disliked: 0 };

                // Determine the like/dislike status based on the fetched data
                if (tempLikeData) {
                    switch (tempLikeData.status) {
                        case 1:
                            likeData = { liked: 1, disliked: 0 };
                            break;
                        case 2:
                            likeData = { liked: 0, disliked: 0 };
                            break;
                        case 0:
                            likeData = { liked: 0, disliked: 1 };
                            break;
                        default:
                            likeData = { liked: 0, disliked: 0 };
                    }
                }

                // Construct the URL for the template
                const url = `https://beacon-git-main-ac-ankurs-projects.vercel.app/template/${beacon.template_id}`;

                // Respond with the success status, template URL, and like/dislike data
                return res.status(200).json({ status: "success", url: url, templateId: beacon.template_id, like_Data: likeData });
            } else {
                // Handle the case where the beacon does not have an associated template
                return res.status(200).json({ status: "failure", message: "No template is assigned to this beacon" });
            }
        } else {
            // Handle the case where the beacon was not found in the database
            return res.status(200).json({ status: "failure", message: "Beacon not found" });
        }
    } catch (error) {
        // Log the error details and return an internal server error response
        console.log(error.name, error.message);
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
};


// USER IS SAVED TO BEACON VISITED
const beaconVisited = async (data) => {
    const uniqueId = data.device_uniqueID;
    try {
        // Create BeaconVisited record and fetch user data in parallel
        
        const data2 = await BeaconVisited.create({
            beacon_mac: data.mac,
            device_id: uniqueId,
            location: data.location,
            temp_id: data.temp_id
        })        
        return data2;
    } catch (error) {
        console.log(error);
        return null;
    }
};


const templateAsignToBeacon = async (req, res) => {
    try {
        // CHECK BEACON EXISTANCE
        const beacon = await Beacon.findOne({
            attributes: ['template_id'],
            where: {
                beacon_id: req.body.beacon_id
            }
        })
        if (!beacon) {
            return res.status(200).json({ status: "failure", message: "beacon not found" })
        }
        // CHECK TEMPLATE EXISTANCEs
        const template = await Template.findOne({
            attributes: ['temp_id'],
            where: {
                temp_id: req.body.template_id
            }
        });
        console.log(template);

        if (!template) {
            return res.status(200).json({ status: "failure", message: "template not found" })
        }
        // set TEMPLATE TO BEACON
        var beaconUpdate = await Beacon.update({
            template_id: req.body.template_id
        }, {
            where: {
                beacon_id: req.body.beacon_id
            }
        })
        // console.log(beaconUpdate);

        if (beaconUpdate > 0) {
            return res.status(200).json({ status: "success", message: "template " + req.body.template_id + " is asign to beacon " + req.body.beacon_id })
        } else {
            return res.status(200).json({ status: "failue", message: "template " + req.body.template_id + " is Not asign to beacon " + req.body.beacon_id })
        }
    } catch (error) {
        console.log(error.name, error.message);
        return res.status(500).json({ status: "failure", message: "Internal server error" })

    }
}

module.exports = {
    beaconFire,
    templateAsignToBeacon
}