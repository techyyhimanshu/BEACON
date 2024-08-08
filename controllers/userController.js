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

module.exports={
    trackUser
}