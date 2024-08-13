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
            COUNT(bv.user_mac) AS counts
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


const beaconWeekUser = async (req, res) => {
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
    beaconWeekUser,
    beaconTotalUser,
    getAllUsers
}