const db = require("../models");
const Sequelize = require('sequelize');
// const Category=db.Category

const trackUser = async(req,res)=>{
try {
    const userBeaconData = await db.sequelize.query(`
        SELECT Beacons.beacon_name,
        ShopDetails.shop_name,
        OrganizationDetails.org_name,
        OrganizationDetails.address,
        BeaconVisited.location,
        BeaconVisited.createdAt
        FROM BeaconVisited ,OrganizationDetails,Beacons,ShopDetails
        WHERE  BeaconVisited.user_mac= ?
        AND Beacons.mac = BeaconVisited.beacon_mac
        AND  Beacons.shop_id = ShopDetails.shop_id
        AND  OrganizationDetails.org_id=ShopDetails.org_id
        ORDER BY BeaconVisited.createdAt DESC;`,
        {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [req.body.user_mac]
        })
    if(userBeaconData){
        res.status(200).json({status:"success",data:userBeaconData})
    }else{
        res.status(404).json({status:"failure",message:"Not found"})
    }
} catch (error) {
    res.status(404).json({status:"failure",message:"Internal server error", Error : error.message })
}
}

const beaconTotalUser = async(req,res)=>{
    try {
        const beaconTotalUser = await db.sequelize.query(`
            SELECT COUNT(DISTINCT BeaconVisited.user_mac) 
            FROM BeaconVisited 
            WHERE BeaconVisited.beacon_mac = ?; `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.mac]
            })
        if(beaconTotalUser){
            res.status(200).json({status:"success",data:beaconTotalUser})
        }else{
            res.status(404).json({status:"failure",message:"Not found"})
        }
    } catch (error) {
        res.status(404).json({status:"failure",message:"Internal server error", Error : error.message })
    }
    }

const beaconTodayUser = async(req,res)=>{
        try {
            const beaconTodayUser = await db.sequelize.query(`
                SELECT COUNT(distinct BeaconVisited.user_mac) 
                FROM BeaconVisited
                WHERE BeaconVisited.beacon_mac = ?
                AND DATE(BeaconVisited.createdAt) = CURDATE(); `,
                {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: [req.body.mac]
                })
            if(beaconTodayUser){
                res.status(200).json({status:"success",data:beaconTodayUser})
            }else{
                res.status(404).json({status:"failure",message:"Not found"})
            }
        } catch (error) {
            res.status(404).json({status:"failure",message:"Internal server error", Error : error.message })
        }
    }
    
    
const beaconWeekUser = async(req,res)=>{
        try {
            const beaconWeekUser = await db.sequelize.query(`
                SELECT COUNT(distinct BeaconVisited.user_mac) 
                FROM BeaconVisited
                WHERE BeaconVisited.beacon_mac = ?
                AND DATE(BeaconVisited.createdAt) > (CURDATE()- INTERVAL 7 DAY); `,
                {
                    type: Sequelize.QueryTypes.SELECT,
                    replacements: [req.body.mac]
                })
            if(beaconWeekUser){
                res.status(200).json({status:"success",data:beaconWeekUser})
            }else{
                res.status(404).json({status:"failure",message:"Not found"})
            }
        } catch (error) {
            res.status(404).json({status:"failure",message:"Internal server error", Error : error.message })
        }
    }


module.exports={
    trackUser,
    beaconTodayUser,
    beaconWeekUser,
    beaconTotalUser
}