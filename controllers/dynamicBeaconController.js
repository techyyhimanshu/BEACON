const db = require("../models");
const Sequelize = require('sequelize');
const TempButton =db.tbl_temp_button;
const TempContent =db.tbl_temp_content;
const TempSubMenu =db.tbl_temp_menu;
const Template =db.tbl_template;
const Beacon =db.Beacon;
const BeaconVisited =db.BeaconVisited;
const User =db.user;

const beaconFire = async(req,res)=>{
    try{
        const beacon = await Beacon.findOne({
            attributes : ['template_id'],
            where:{
                mac: req.body.mac
            }
        })
        if(beacon.template_id)
        {
            // beacon found
            const visitedData = beaconVisited(req.body)
            var url = "https://beacon-cz70.onrender.com/api/fetch/dynamicTemplate/" + beacon.template_id
            res.status(200).json({status:"success",url:url})
        }
        else if(beacon.template_id===null){
            res.status(200).json({status:"failure",message:"no template is asign to this beacon "})
        } else{
            res.status(200).json({status:"failure",message:"beacon not found"})
        }

    }catch(error){
        res.status(404).json({status:"failure",message:"error occur on beacon fire"})
        console.log(error.name,error.message);
        
    }

}

// USER IS SAVED TO BEACON VISITED 
const beaconVisited = async (data) => {
    try {
        const data2 = await BeaconVisited.create({
            beacon_mac: data.mac,
            user_mac: data.device_uniqueID,
            location: data.location
        });
        if (data2) {
                var user = await User.findOne({
                    attributes : ['user_mac'],
                    where:{
                        user_mac : data.device_uniqueID
                    }
                })
                if(!user)
                    {
                    var newUser = await User.create({
                        user_mac: data.device_uniqueID,
                        last_location: data.location
                    })
                } else {
                    const updatedresult = await db.sequelize.query(`
                        UPDATE Users SET 
                        last_location = ? 
                        WHERE user_mac = ? ;`,
                        {
                            type: Sequelize.QueryTypes.UPDATE,
                            replacements: [data.location, data.device_uniqueID]
                        });
                    //console.log(updatedresult);
                    
                }
                return data2
        } else {
            return null
        }
    } catch (error) {
        console.log(error);
        return null
    }
}

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