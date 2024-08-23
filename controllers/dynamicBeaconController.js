const db = require("../models");
const Sequelize = require('sequelize');
const TempButton =db.tbl_temp_button;
const TempContent =db.tbl_temp_content;
const TempSubMenu =db.tbl_temp_menu;
const Template =db.tbl_template;
const Beacon =db.Beacon;
const BeaconVisited =db.BeaconVisited;
const User =db.user;

const beaconFire = async (req, res) => {
    try {
        const beacon = await Beacon.findOne({
            attributes: ['template_id'],
            where: { mac: req.body.mac }
        });

        if (beacon) {
            if (beacon.template_id) {
                // beacon found, process in parallel
                beaconVisited(req.body); // Process in the background without waiting
                
                const url = `https://beacon-git-main-ac-ankurs-projects.vercel.app/template/${beacon.template_id}`;
                return res.status(200).json({ status: "success", url });
            } else {
                return res.status(200).json({ status: "failure", message: "no template is assigned to this beacon" });
            }
        } else {
            return res.status(200).json({ status: "failure", message: "beacon not found" });
        }
    } catch (error) {
        console.log(error.name, error.message);
        return res.status(404).json({ status: "failure", message: "error occurred on beacon fire" });
    }
};

// USER IS SAVED TO BEACON VISITED
const beaconVisited = async (data) => {
    try {
        const uniqueId = data.device_uniqueID;

        const [data2, user] = await Promise.all([
            BeaconVisited.create({
                beacon_mac: data.mac,
                user_mac: uniqueId,
                location: data.location
            }),
            User.findOne({
                attributes: ['user_mac', 'last_location'],
                where: { user_mac: uniqueId }
            })
        ]);

        if (user) {
            // USER IS OLD, update only if location has changed
            if (user.last_location !== data.location) {
                await User.update(
                    { last_location: data.location },
                    { where: { user_mac: uniqueId } }
                );
            }
        } else {
            // USER IS NEW
            await User.create({
                user_mac: uniqueId,
                last_location: data.location
            });
        }

        return data2;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const templateAsignToBeacon = async(req,res)=>{
    try{
        // CHECK BEACON EXISTANCE
        const beacon = await Beacon.findOne({
            attributes : ['template_id'],
            where:{
                beacon_id: req.body.beacon_id
            }
        })
        if(!beacon)
            {   res.status(404).json({status:"failure",message:"beacon not found"})
        }
        // CHECK TEMPLATE EXISTANCE
        const template = await Beacon.findOne({
            attributes : ['template_id'],
            where:{
                template_id: req.body.template_id
            }
        })
        if(!template)
            {   res.status(404).json({status:"failure",message:"template not found"})
        }
        // set TEMPLATE TO BEACON
        var beaconUpdate =  await Beacon.update({
            template_id : req.body.template_id                
            },{
                where : {                        
                    beacon_id: req.body.beacon_id
                }
            })
            console.log(beaconUpdate);
            
        if(beaconUpdate > 0){
            res.status(200).json({status:"success",message:"template " + req.body.template_id + " is asign to beacon "+ req.body.beacon_id})
        } else {
            res.status(404).json({status:"failue",message:"template " + req.body.template_id + " is Not asign to beacon "+ req.body.beacon_id})
        }
    }catch(error){
        res.status(404).json({status:"failure",message:"error occur on beacon fire"})
        console.log(error.name,error.message);
    }
}

module.exports= {
    beaconFire,
    templateAsignToBeacon
}