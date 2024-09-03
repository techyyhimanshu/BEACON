const db = require("../models")
const Category = db.Category
const TemplateType = db.temptype
const Template = db.template
const Division = db.Division
const Beacon = db.Beacon
const BeaconTemplate = db.BeaconTemplate



const Sequelize = require("sequelize")
//const temptype = require("../models/temptype")


const createTemplate = async (req, res) => {

    //#region GLT KAAM
    /*  try {
        const templateData = await TemplateType.findOne({
            where: {
                templateType_id: req.body.template_id
            },
            attributes:["templateType_id"]
        })
        if (templateData) {
            const beaconData = await Beacon.findByPk(req.body.beacon_id,{
                attributes:["beacon_id"]
            })
            if (beaconData) {
                const createdData = await BeaconTemplate.create(req.body)
                if (createdData) {
                    res.status(200).json({ status: 'success', message: "Template assigned " })
                } else {
                    res.status(200).json({ status: 'failure', message: "Error occured" })
                }
            } else {
                res.status(404).json({ status: 'failure', message: "Beacon not found" })
            }
        } else {
            res.status(404).json({ status: 'failure', message: "Template not  found" })
        }
     } catch (error) {

     }
    */
   //#endregion

    try {
        // console.log("call creation");
        
        const orgBeacons = await db.sequelize.query(`
                select BeaconTemplates.alias 
                from beaconDB.BeaconTemplates 
                where BeaconTemplates.beacon_id in
                (select Beacons.beacon_id
                from beaconDB.Beacons, beaconDB.ShopDetails
                where Beacons.shop_id = ShopDetails.shop_id 
                AND ShopDetails.org_id = 
                (select org_id from ShopDetails 
                where shop_id = 
                (select shop_id from Beacons 
                where beacon_id = ?)));`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.beacon_id]
            });
            // console.log(orgBeacons,'======',req.body.alias);
            
            for(let beaAlias of orgBeacons ) {
                if (beaAlias.alias == req.body.alias)
                {res.status(200).json({ status: "failure", message: "Template alias can not be same in Organization" }) 
                break;
            }
            }

        const templateType = await TemplateType.findByPk(req.body.template_type_id * 1)

        if (!templateType) {
            res.status(404).json({ status: 'failure', message: "Template url not  found" })
        } else {
            var offerData1 = '';
            var offerData2 = '';
            var body_offer_1 = req.body.offer_data_1;
            var body_offer_2 = req.body.offer_data_2;
            if (body_offer_1 != undefined) {
                console.log("body first");
                offerData1 = body_offer_1.replaceAll(' ', '%20');
            }
            if (body_offer_2 != undefined) {
                console.log("body second");
                offerData2 = body_offer_2.replaceAll(' ', '%20');
            }

            const data = await Template.create({
                templateType_id: req.body.template_type_id,
                valid_from: req.body.valid_from,
                valid_till: req.body.valid_till,
                offer_data_1: offerData1,
                offer_data_2: offerData2
            })
            if (data) {
                const checkBeaconTemplate = await Beacon.findOne({
                    attributes: ["template_id"],
                    where: {
                        beacon_id: req.body.beacon_id
                    }
                })

                if (checkBeaconTemplate.template_id === null) {
                    //---Parent template----------
                    const updateBeaconTemplate = await Beacon.update(
                        { template_id: data.template_id }, {
                        where: {
                            beacon_id: req.body.beacon_id
                        }
                    } )
                    const addToBeaconTemplateParent = await BeaconTemplate.create(
                        {
                            template_id: data.template_id,
                            beacon_id: req.body.beacon_id,
                            alias: req.body.alias
                        })
                    if (addToBeaconTemplateParent == 0) {
                        res.status(200).json({ status: "failure", message: "no beacon asign to this shop" })
                    }
                    else {
                        res.status(200).json({ status: "success", message: "Created successfully" })
                    }
                } else {
                    // child template
                    const addToBeaconTemplateChild = await BeaconTemplate.create(
                        {
                            template_id: data.template_id,
                            beacon_id: req.body.beacon_id,
                            parent: checkBeaconTemplate.template_id,
                            alias: req.body.alias
                        })
                    if (addToBeaconTemplateChild == 0) {
                        res.status(200).json({ status: "failure", message: "no beacon asign to this shop" })
                    }
                    else {
                        res.status(200).json({ status: "success", message: "Created successfully" })
                    }
                }
            }
            else {
                res.status(200).json({ status: "fail", message: "data is not found", data: data })
            }
        }

    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            res.status(500).json({ status: "failure", message: "Internal Server Error" });
        }
    }
}


const getShopBeacon = async (req, res) => {
    try {
        const shopBeacons = await Beacon.findAll({
            attributes: ["beacon_id", "mac"],
            where: {
                shop_id: req.params.id
            }
        })
        if (shopBeacons.length !== 0) {
            res.status(200).json({ status: "success", message: shopBeacons })
        } else {
            res.status(404).json({ status: "Not found", message: "no beacon added to this shop" })
        }
    } catch (e) { res.status(500).json({ status: "failure", message: "Internal Server Error" }); }
}


const getAllTemplate = async (req, res) => {
    try {
        const data = await Template.findAll({
            attributes: ['template_id', 'valid_from', 'valid_till', 'offer_data_1', 'offer_data_2'],
            include: {
                model: TemplateType,
                attributes: ["template_path"],
                include:{
                    model:Category,
                    attributes:['category_name']
                }
            }
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(200).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }
}


const getMyTemplate = async (req, res) => {
    try {
        const data = await Beacon.findAll({
            attributes: ['mac'],
            include: [{
                model: Template,
                attributes: ['templateType_id', 'valid_from', 'valid_till', 'offer_data_1', 'offer_data_2'],
                order: [
                    ['valid_till', 'ASC']
                ]
            }, {
                model: Shop,
                attributes: ['shop_name'],
            }
            ],
            where: {
                // cmment it after token
                shop_id: req.params.id
            }

        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(200).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}

const updateMyTemplate = async (req, res) => {
    console.log("req body" + req.body);
    try {
        console.log("update method call");

        var offerData1 = (req.body.offer_data_1).replaceAll(' ', '%20');
        var offerData2 = (req.body.offer_data_2).replaceAll(' ', '%20');

        const [affectedRow] = await Template.update({
            templateType_id: req.body.templateType_id,
            valid_from: req.body.templateType_id,
            valid_till: req.body.valid_till,
            offer_data_1: offerData1,
            offer_data_2: offerData2
        }, {
            where: {
                template_id: req.body.template_id
            }
        })
        console.log(affectedRow);
        if (affectedRow === 1) {
            res.status(200).json({ status: "success", message: "Updated successfully" })
        }
        else {
             res.status(200).json({ status: "failure", message: "Record not found!!!" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }

}

const deleteMyTemplate = async (req, res) => {
    try {
        const affectedRow = await Template.destroy({
            where: {
                template_id: req.body.template_id
            }
        })
        if (affectedRow === 1) {
            res.status(200).json({ status: "success", message: "Deleted successfully" })
        }
        else {
            res.status(200).json({ status: "failure", message: "Record not found for delete" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure", message: "Internal Server Error" });
    }
}

// ASIGN BUILEDED TEMPLATE TO BEACON
const asignTemplateToBeacon = async (req, res) => {
    try {
        // CHECK BEACON ISEXIST OR NOT
        const checkBeacon = await Beacon.findOne({
            attributes: ["beacon_id"],
            where: {
                beacon_id: req.body.beacon_id
            }
        });
        if(!checkBeacon)
        {  res.status(200).json({ status: "failure", message: "beacon is not found"});      }

        // CHECK WEEATHER TEPMALTE EXIST OR NOT
        const checkTemplate = await Template.findOne({
            attributes: ["template_id"],
            where: {
                template_id: req.body.template_id
            }
        })
        if(!checkTemplate)
        {  res.status(200).json({ status: "failure", message: "template is not found"});      }

        // IS BEACON ALREADY HAVE ANY TEMPLATE ?
        const checkBeaconTemplate = await Beacon.findOne({
            attributes: ["template_id"],
            where: {
                beacon_id: req.body.beacon_id
            }
        })
        if (checkBeaconTemplate.template_id === null) {
            //--- ADD Parent template----------
            const updateBeaconTemplate = await Beacon.update(
                { template_id: req.body.template_id }, {
                where: {
                    beacon_id: req.body.beacon_id
                    }
                });
            const addToBeaconTemplateParent = await BeaconTemplate.create(
                {
                    template_id: req.body.template_id,
                    beacon_id: req.body.beacon_id,
                    alias: req.body.alias
                });
            const updateTemplateParent = await BeaconTemplate.update(
                {
                    beacon_id: req.body.beacon_id,
                },{
                    where:{
                        parent : req.body.template_id
                    }  
                });
            if (addToBeaconTemplateParent == 0) {
                res.status(200).json({ status: "failure", message: "no beacon asign to this shop" })
            }
            else {
                res.status(200).json({ status: "success", message: "Created successfully" })
            }
        } else {
            // IN ELSE CASE BEACON HAVE ALREADY A TEMPLATE 
            // child template
            const addToBeaconTemplateChild = await BeaconTemplate.create(
                {
                    template_id: req.body.template_id,
                    beacon_id: req.body.beacon_id,
                    parent: checkBeaconTemplate.template_id,
                    alias: req.body.alias
                })
            if (addToBeaconTemplateChild == 0) {
                res.status(200).json({ status: "failure", message: "no beacon asign to this shop" })
            }
            else {
                res.status(200).json({ status: "success", message: "Child Created successfully" })
            }
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }
}

const createChildTemplate = async (req, res) => {

    try {
        // console.log("call creation");
        //#region CHECK ALIAS BY BEACON OR ORG ID
        // const orgBeacons = await db.sequelize.query(`
        //         select BeaconTemplates.alias 
        //         from beaconDB.BeaconTemplates 
        //         where BeaconTemplates.beacon_id in
        //         (select Beacons.beacon_id
        //         from beaconDB.Beacons, beaconDB.ShopDetails
        //         where Beacons.shop_id = ShopDetails.shop_id 
        //         AND ShopDetails.org_id = 
        //         (select org_id from ShopDetails 
        //         where shop_id = 
        //         (select shop_id from Beacons 
        //         where beacon_id = ?)));`,
        //     {
        //         type: Sequelize.QueryTypes.SELECT,
        //         replacements: [req.body.beacon_id]
        //     });
        //     // console.log(orgBeacons,'======',req.body.alias);
            
        //     for(let beaAlias of orgBeacons ) {
        //         if (beaAlias.alias == req.body.alias)
        //         {res.status(200).json({ status: "failure", message: "Template alias can not be same in Organization" }) 
        //         break;
        //     }
        //     }
        //#endregion

        const templateType = await TemplateType.findByPk(req.body.template_type_id * 1)

        if (!templateType) {
            res.status(404).json({ status: 'failure', message: "Template url not  found" })
        } else {
            // data filtration
            var offerData1 = '';
            var offerData2 = '';
            var body_offer_1 = req.body.offer_data_1;
            var body_offer_2 = req.body.offer_data_2;
            if (body_offer_1 != undefined) {
                console.log("body first");
                offerData1 = body_offer_1.replaceAll(' ', '%20');
            }
            if (body_offer_2 != undefined) {
                console.log("body second");
                offerData2 = body_offer_2.replaceAll(' ', '%20');
            }

            // CHECK Master TEMPLATE EXISTATNCE
            const templateParent = await Template.findByPk(req.body.Parent_template_id * 1)
            if (!templateParent) {
                res.status(404).json({ status: 'failure', message: "Create Master Template First" })
            }

            const data = await Template.create({
                templateType_id: req.body.template_type_id,
                valid_from: req.body.valid_from,
                valid_till: req.body.valid_till,
                offer_data_1: offerData1,
                offer_data_2: offerData2
            })
            if (data) {
                    const addToBeaconTemplateParent = await BeaconTemplate.create(
                        {
                            parent: req.body.Parent_template_id,
                            template_id : data.template_id,
                            // beacon_id: req.body.beacon_id,
                            alias: req.body.alias
                        })
                    if (addToBeaconTemplateParent == 0) {
                        res.status(200).json({ status: "failure", message: "child template is not asign with template " })
                    }
                    else {
                        res.status(200).json({ status: "success", message: "Created successfully" })
                    }
            } else{
                res.status(404).json({ status: "failure", message: "error in template creation !" })
            }
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            res.status(400).json({ status: "failure", message: error.message });
        }
    }
}



module.exports = {
    createTemplate,
    getAllTemplate,
    updateMyTemplate,
    deleteMyTemplate,
    getShopBeacon,
    getMyTemplate,
    asignTemplateToBeacon,
    createChildTemplate
}