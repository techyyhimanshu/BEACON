const db = require("../models")
const Category = db.Category
const TemplateType = db.temptype
const Template = db.template
const Shop = db.Shop
const Beacon = db.Beacon
const BeaconTemplate = db.BeaconTemplate



const Sequelize = require("sequelize")
//const temptype = require("../models/temptype")


const createTemplate = async (req, res) => {
    // try {
    //     const templateData = await TemplateType.findOne({
    //         where: {
    //             templateType_id: req.body.template_id
    //         },
    //         attributes:["templateType_id"]
    //     })
    //     if (templateData) {
    //         const beaconData = await Beacon.findByPk(req.body.beacon_id,{
    //             attributes:["beacon_id"]
    //         })
    //         if (beaconData) {
    //             const createdData = await BeaconTemplate.create(req.body)
    //             if (createdData) {
    //                 res.status(200).json({ status: 'success', message: "Template assigned " })
    //             } else {
    //                 res.status(200).json({ status: 'failure', message: "Error occured" })
    //             }
    //         } else {
    //             res.status(404).json({ status: 'failure', message: "Beacon not found" })
    //         }
    //     } else {
    //         res.status(404).json({ status: 'failure', message: "Template not  found" })
    //     }
    // } catch (error) {

    // }
    try {
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
                    }
                    )
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
            res.status(400).json({ status: "failure", message: error.message });
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
    } catch (e) { res.status(400).json({ status: "failure", message: e.message }); }
}


const getAllTemplate = async (req, res) => {
    try {
        const data = await Template.findAll({
            attributes: ['template_id', 'valid_from', 'valid_till', 'offer_data_1', 'offer_data_2'],
            include: {
                model: TemplateType,
                attributes: ["template_path"]
            }
        })
        if (data) {
            res.status(200).json({ status: "success", data: data })
        }
        else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
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
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
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
            // res.status(404).json({ status: "failure", message: "Record not found!!!" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
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
            res.status(404).json({ status: "failure", message: "Record not found for delete" })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ status: "failure" });
    }

}
module.exports = {
    createTemplate,
    getAllTemplate,
    updateMyTemplate,
    deleteMyTemplate,
    getShopBeacon,
    getMyTemplate
}