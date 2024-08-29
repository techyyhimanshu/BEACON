const db = require("../models");
const Sequelize = require('sequelize');
const User = db.user
const DeviceFcmToken = db.DeviceFcmToken
const admin = require("../config/firebase");



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
            type: Sequelize.QueryTypes.SELECT
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
            res.status(200).json({ status: "success", data: totalBeaconsWithCount })
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

const orgWeeklyUsers = async (req, res) => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    try {
        const { start_date, end_date } = req.body
        if (req.body.start_date === req.body.end_date) {
            return res.status(200).json({ status: "success", message: "start_date and end_date must not be same" })
        }
        if (end_date > currentDate || start_date > end_date) {
            return res.status(200).json({ status: "success", message: "Invalid date range" })
        }
        const beaconWeekUserCount = await db.sequelize.query(`
                select o.org_name,o.org_id,count(distinct bv.user_mac) as total_user_count
                from OrganizationDetails o
                join 
                    ShopDetails s on s.org_id=o.org_id
                join 
                    Beacons b on b.shop_id=s.shop_id
                join
                    BeaconVisited bv on bv.beacon_mac=b.mac
                where o.org_id=?
                     and bv.createdAt between ? and ?
                group by
                    o.org_id,o.org_name `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.org_id, req.body.start_date, req.body.end_date]
            })

        if (!beaconWeekUserCount || beaconWeekUserCount.length === 0) {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
        const weeklyBeacons = await db.sequelize.query(`
            select b.beacon_name,s.shop_name as division_name,b.beacon_id,count(distinct bv.user_mac) as user_count
                from OrganizationDetails o
                join 
                    ShopDetails s on s.org_id=o.org_id
                join 
                    Beacons b on b.shop_id=s.shop_id
                join
                    BeaconVisited bv on bv.beacon_mac=b.mac
                where o.org_id=?
                     and bv.createdAt between ? and ?
                group by
                    o.org_id,b.mac `,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.org_id, req.body.start_date, req.body.end_date]
            })
        beaconWeekUserCount[0].beacons = weeklyBeacons
        res.status(200).json({ status: "success", data: beaconWeekUserCount })
    } catch (error) {
        res.status(500).json({ status: "failure", message: "Internal server error" })
        console.log(error);

    }
}

const orgMonthlyUsers = async (req, res) => {
    try {
        if (!req.body.org_id || !req.body.month) {
            return res.status(404).json({ status: "failure", message: "Please provide org_id and month" })
        }
        const monthlyOrgData = await db.sequelize.query(`
                SELECT 
                o.org_name,
                o.org_id,
                COUNT(distinct bv.user_mac) AS total_user_visited
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
                    o.org_id, o.org_name;`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.org_id, req.body.month]
            })
        if (monthlyOrgData.length === 0 || !monthlyOrgData) {
            return res.status(404).json({ status: "failure", message: "Not data found for selected month or beacon" })
        }
        const beaconData = await db.sequelize.query(`SELECT 
            b.beacon_id,
            b.beacon_name,
            s.shop_name as division_name,
            COUNT(distinct bv.user_mac) AS user_visited
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
                b.mac`, {
            type: Sequelize.QueryTypes.SELECT,
            replacements: [req.body.org_id, req.body.month]
        })
        monthlyOrgData[0].beacons = beaconData
        res.status(200).json({ status: "success", data: monthlyOrgData })
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

const registerUser = async (req, res) => {
    try {
        const userRegistered = await User.create(req.body)
        if (!userRegistered) {
            return res.status(400).send({ status: "failure", message: "Error occured" })
        }
        return res.status(200).send({ status: "success", message: "User registered successfully" })
    } catch (error) {
        if(error instanceof Sequelize.ValidationError){
            const messages=error.errors.map(err=>err.message)
            return res.status(400).send({ status: "failure", message: messages})
        }
        
        return res.status(500).send({ status: "failure", message: "Internal server error"})

    }
}

const registerFCM = async (req, res) => {
    try {
        const {device_uniqueID,fcm_token}=req.body
        const userFcm=await DeviceFcmToken.findOne({
            attributes:["fcm_token"],
            where:{
                device_id:device_uniqueID
            }
        })
        
        if(userFcm===null||!userFcm || userFcm.fcm_token.length===0){
            const createdFCM = await DeviceFcmToken.create({
                device_id: device_uniqueID,
                fcm_token: fcm_token
            })
    
            if (!createdFCM){
                return res.status(400).send({ status: "failure", message: "Error occured"})
            }
            await sendMessageToUser("Welcome","you are in beacon zone ",req.body.fcm_token)
            return res.status(200).send({ status: "success", message: "FCM token created"})
           
        }
        if(fcm_token===userFcm.fcm_token){            
           await sendMessageToUser("Welcome","you are in beacon zone ",req.body.fcm_token)
            return res.status(200).send({ status: "success", message: "FCM token no-change"})
        }
        const fcmUpdate = await DeviceFcmToken.update({
            fcm_token:fcm_token
        },{
            where:{
                device_id:device_uniqueID
            }
        })
        if(!fcmUpdate){
            return res.status(400).send({ status: "failure", message: "Error occured"})
        }
        await sendMessageToUser("Welcome","you are in beacon zone ",req.body.fcm_token)
        return res.status(200).send({ status: "success", message: "FCM token updated"})
    } catch (error) {
        console.log(error);
        return false
    }
}

const sendMessageToUser = async (title, body, token) => {
    try {
        console.log(token);
        
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };
    
        try {
            const response = await admin.messaging().send(message);
            console.log('Successfully sent message:', response);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    } catch (error) {
        console.log(error.message);
        
    }
};

const viewTime = async (req, res) => {
    try {
        const bodyData = req.bodyData
        const data = await db.sequelize.query(`
            call sp_viewTime(?,?)
            `,
            { replacements : [req.body.user_uniqueID,req.body.date] }
            , (err , result) => {
                if(err)
                {
                    return res.status(400).json({ status: "failure", message: err.message})
                } else{
                    return  res.status(200).json({ status: "success", message: "sp run successfully" ,data:result})
                }
            }
            )
        if (data) {
            return res.status(200).json({ status: "success", message: "Created successfully" ,data:data})
        }
        else{
            return res.status(200).json({ status: "fail", message: "data is not found"  })
        }

    } catch (error) {
        return res.status(400).json({ status: "failure", message: error.message });
    }

}

module.exports = {
    trackUser,
    beaconTodayUser,
    orgWeeklyUsers,
    beaconTotalUser,
    getAllUsers,
    orgMonthlyUsers,
    registerUser,
    registerFCM,
    viewTime
}