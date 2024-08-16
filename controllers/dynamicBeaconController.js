const db = require("../models");
const TempButton =db.tbl_temp_button;
const TempContent =db.tbl_temp_content;
const TempSubMenu =db.tbl_temp_menu;
const Template =db.tbl_template;
const Beacon =db.Beacon;



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
            var url = "http://127.0.0.1:3000/api/fetch/dynamicTemplate/" + beacon.template_id
            res.status(200).json({status:"failure",url:url})
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