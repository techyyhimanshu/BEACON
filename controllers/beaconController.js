const db = require("../models")
const Beacon = db.Beacon
const Shop = db.Shop
const Template = db.template;
const TemplateType = db.temptype


const Sequelize = require("sequelize")
const appclass = require("../appClass");

const addBeacon = async (req, res) => {
    try {
        const shop = await Shop.findByPk(req.body.shop_id);
        if(!shop){
            return res.status(404).json({ status: "failure", message: "Shop not found" });
        }
        const data = await Beacon.create(req.body)
        if (data) {
            res.status(200).json({ status: "success", message: "Created successfully" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            console.log(error);
        }
    }

}

function getDifference(date_1,date_2) {
    let date1 = new Date(date_1);
    let date2 = new Date(date_2);

    // Calculating the time difference
    // of two dates
    let Difference_In_Time =
        date2.getTime() - date1.getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days =
        Math.round
            (Difference_In_Time / (1000 * 3600 * 24));
    console.log("day difference is " + Difference_In_Days)
    return Difference_In_Days;
}

// search template for beacon 
async function findUrl(macAddress) {
    try{
    var beaconData =await Beacon.findOne({
        attributes : ["template_id"],
        where:{
            mac : macAddress
            }
        })
        if (beaconData){
            //check template existence
            var templateData =await Template.findOne({
                attributes : ['valid_from','valid_till','templateType_id','offer_data_1','offer_data_2'],
                where: {
                    template_id: beaconData.template_id,
                    deletedAt : null
                }
            })
            console.log("template data is -------------" + templateData.get("valid_from"));
            if(templateData != null){
                today = new Date()
                const beforeTime = getDifference(templateData.get("valid_from"),today)
                const afterTime = getDifference(today,templateData.get("valid_till"))

                // Is offer valid today

                console.log("before time " + beforeTime + "----------- after time " + afterTime);

                if(beforeTime >= 0 && afterTime > 0){
                    console.log("offer is valid today");
                    var templateTypeData =await TemplateType.findOne({
                        attributes : ['template_path'],
                        where:{
                            templateType_id : templateData.templateType_id
                        }
                    })
                    var lauchUrl = templateTypeData.template_path + templateData.offer_data_1 + '/' + templateData.offer_data_2 
                    console.log("Successful ............. url is builded for beacon "+ lauchUrl);
                    return lauchUrl;
                }else{
                    return "there is no offer valid today ....";
                }
            } else {
                return "sorry !! template data is not fonud..........";
            }
        } else {
            return "sorry !! beacon data is not fonud..........";
        }
    } catch(e){
        return "error occured : "+ e.message
    } 
    
}

const login = async (req, res) => {
    try {
        const data = await Beacon.findOne({
            where:{
                mac:req.body.mac
            }
        })
        if (data) {
            const builedUrl = await findUrl(req.body.mac)
            //appclass.myclass();
            //appclass.appclass();
            if (builedUrl){
                res.status(200).json({ status: "success", url:builedUrl })
            } else {
                res.status(200).json({ status: "success", url:"https://www.google.com" })
            }
        }
        else{
            res.status(200).json({ status: "beacon is not added yet", url:"https://www.google.com" })
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        }else{
            console.log(error);
        }
    }

}
module.exports={
    addBeacon,
    login
}