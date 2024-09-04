const db = require("../models")
const OrgMenu = db.OrgMenu
const Organization = db.Organization
const Menu = db.menu

const createOrgMenuItem = async (req, res) => {
    try {
        const { org_id, menu_id } = req.body
        const orgData = await Organization.findByPk(org_id)
        if (orgData) {
            const menuData = await Menu.findByPk(menu_id,{
                attributes:["menu_id","menu_name","base_url"]
            })
            if (menuData) {
                const orgUrl=menuData.base_url+"?org="+orgData.org_id+"&menu="+menuData.menu_id
                const insertedData = await OrgMenu.create({
                    menu_id:menuData.menu_id,
                    org_id:orgData.org_id,
                    alias:req.body.alias,
                    url:orgUrl
                })
                if (insertedData.length !== 0) {
                    res.status(200).json({ status: "success", message: "Created successfully" });
                } else {
                    res.status(200).json({ status: "failure", message: "Error occured" });
                }
            } else {
                res.status(200).json({ status: "failure", message: "Menu not found" });
            }
        } else {
            res.status(200).json({ status: "failure", message: "Organization not found" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }

}
const getOrgMenuItems= async (req, res) => {
    try {
        const menuData=await OrgMenu.findAll({
            attributes:["org_menu_id","alias","url"],
            where:{
                org_id:req.params.id
            }
        })
        if(menuData){
            res.status(200).json({ status: "success", data:menuData });
        }else{
            res.status(200).json({ status: "failure", message:"Not found" });
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message);
            res.status(400).json({ status: "failure", message: errorMessages });
        } else {
            res.status(500).json({ status: "failure", message: "Internal server error" });
        }
    }

}
module.exports = {
    createOrgMenuItem,
    getOrgMenuItems
}