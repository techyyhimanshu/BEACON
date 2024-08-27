const db = require("../models");
const Sequelize = require('sequelize');
const User = db.user

const trackUser = async (req, res) => {
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
        if (userBeaconData) {
            res.status(200).json({ status: "success", data: userBeaconData })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}

const beaconTotalUser = async (req, res) => {
    try {
        const totalBeaconsWithCount = await db.sequelize.query(`SELECT 
            b.beacon_id,
            b.beacon_name,
            bv.beacon_mac AS beacon_mac,
            COUNT(distinct bv.user_mac) AS connectedUsers
            FROM 
             beaconDB.Beacons b
            JOIN 
            beaconDB.BeaconVisited bv
            ON 
            b.mac = bv.beacon_mac
            GROUP BY 
            b.beacon_id, 
             b.beacon_name, 
                bv.beacon_mac;
`, {
    type:Sequelize.QueryTypes.SELECT
})
        // const beaconTotalUser = await db.sequelize.query(`
        //     SELECT COUNT(DISTINCT BeaconVisited.user_mac) as count
        //     FROM BeaconVisited 
        //     WHERE BeaconVisited.beacon_mac = ?; `,
        //     {
        //         type: Sequelize.QueryTypes.SELECT,
        //         replacements: [req.body.mac]
        //     });
        // const beaconTotalUserData = await db.sequelize.query(`
        //     SELECT DISTINCT BeaconVisited.user_mac
        //     FROM BeaconVisited 
        //     WHERE BeaconVisited.beacon_mac = ?; `,
        //     {
        //         type: Sequelize.QueryTypes.SELECT,
        //         replacements: [req.body.mac]
        //     })
        if (totalBeaconsWithCount) {
            res.status(200).json({ status: "success", data:totalBeaconsWithCount })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}

const beaconTodayUser = async (req, res) => {
    try {
        const beaconTodayUser = await db.sequelize.query(`
                SELECT COUNT(distinct BeaconVisited.user_mac) as count
                FROM BeaconVisited
                WHERE BeaconVisited.beacon_mac = ?
                AND DATE(BeaconVisited.createdAt) = CURDATE(); `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.mac]
            })
        if (beaconTodayUser) {
            res.status(200).json({ status: "success", count: beaconTodayUser[0].count })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}


const beaconWeeklUsers = async (req, res) => {
    try {
        const beaconWeekUser = await db.sequelize.query(`
                SELECT COUNT(distinct BeaconVisited.user_mac) as count
                FROM BeaconVisited
                WHERE BeaconVisited.beacon_mac = ?
                AND DATE(BeaconVisited.createdAt) > (CURDATE()- INTERVAL 7 DAY); `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.mac]
            })
        if (beaconWeekUser) {
            res.status(200).json({ status: "success", count: beaconWeekUser[0].count })
        } else {
            res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}
const beaconMonthlyUsers = async (req, res) => {
    try {
        if(!req.body.org_id || !req.body.month){
            return res.status(404).json({ status: "failure", message: "Please provide org_id and month"})
        }
        const monthlyOrgData = await db.sequelize.query(`
                SELECT 
    o.org_name,
    o.org_id,
    COUNT(bv.user_mac) AS total_user_visited
FROM 
    beaconDB.OrganizationDetails o
JOIN 
    beaconDB.ShopDetails s ON o.org_id = s.org_id
JOIN 
    beaconDB.Beacons b ON s.shop_id = b.shop_id
JOIN 
    beaconDB.BeaconVisited bv ON b.mac = bv.beacon_mac
WHERE 
    o.org_id = ?
    and month(bv.createdAt)=?
GROUP BY 
    o.org_id, o.org_name;
 `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.org_id,req.body.month]
            })
        if (monthlyOrgData.length===0 || !monthlyOrgData) {
           return res.status(404).json({ status: "failure", message: "Not data found for selected month or beacon" })
        }
        const beaconData=await db.sequelize.query(`SELECT 
            b.beacon_id,
            b.beacon_name,
            COUNT(bv.user_mac) AS user_visited
            FROM 
            beaconDB.OrganizationDetails o
            JOIN 
                beaconDB.ShopDetails s ON o.org_id = s.org_id
            JOIN 
                beaconDB.Beacons b ON s.shop_id = b.shop_id
            JOIN 
                beaconDB.BeaconVisited bv ON b.mac = bv.beacon_mac
            WHERE 
                o.org_id = ?
                and month(bv.createdAt)=?
            GROUP BY 
                b.mac`,{
                type: Sequelize.QueryTypes.SELECT,
                replacements:[req.body.org_id,req.body.month]
    })
    monthlyOrgData[0].beacons=beaconData
        res.status(200).json({ status: "success",data: monthlyOrgData })
    } catch (error) {
        res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}
const getAllUsers = async (req, res) => {

    try {
        if (req.username === 'cit_superadmin') {
            const users = await User.findAll({})
            if (users) {
                res.status(200).json({ status: "success", data: users })
            } else {
                res.status(404).json({ status: "failure", message: "Not found" })
            }
        } else {
            res.status(403).json({ status: "failure", message: "Unauthorized" })
        }
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}

module.exports = {
    trackUser,
    beaconTodayUser,
    beaconWeeklUsers,
    beaconTotalUser,
    getAllUsers,
    beaconMonthlyUsers
}