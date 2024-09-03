const db = require("../models");
const Sequelize = require('sequelize');
const argon2 = require('argon2');
const User = db.user
const DeviceFcmToken = db.DeviceFcmToken
const admin = require("../config/firebase");
const { FirebaseAppError } = require("firebase-admin/app");
const { FirebaseMessagingError } = require("firebase-admin/messaging");


const trackUser = async (req, res) => {
    try {
        const userBeaconData = await db.sequelize.query(`
        SELECT Beacons.beacon_name,
        divisionDetails.div_name,
        OrganizationDetails.org_name,
        OrganizationDetails.address,
        BeaconVisited.location,
        BeaconVisited.createdAt
        FROM BeaconVisited ,OrganizationDetails,Beacons,divisionDetails
        WHERE  BeaconVisited.user_mac= ?
        AND Beacons.mac = BeaconVisited.beacon_mac
        AND  Beacons.div_id = divisionDetails.div_id
        AND  OrganizationDetails.org_id=divisionDetails.org_id
        ORDER BY BeaconVisited.createdAt DESC;`,
            {
                type: Sequelize.QueryTypes.SELECT,
                replacements: [req.body.user_mac]
            })
        if (userBeaconData) {
            return res.status(200).json({ status: "success", data: userBeaconData })
        } else {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        return res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
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
            return res.status(200).json({ status: "success", data: totalBeaconsWithCount })
        } else {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        return res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
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
            return res.status(200).json({ status: "success", count: beaconTodayUser[0].count })
        } else {
            return res.status(404).json({ status: "failure", message: "Not found" })
        }
    } catch (error) {
        return res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
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
                    divisionDetails s on s.org_id=o.org_id
                join 
                    Beacons b on b.div_id=s.div_id
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
            select b.beacon_name,s.div_name as division_name,b.beacon_id,count(distinct bv.user_mac) as user_count
                from OrganizationDetails o
                join 
                    divisionDetails s on s.org_id=o.org_id
                join 
                    Beacons b on b.div_id=s.div_id
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
        return res.status(200).json({ status: "success", data: beaconWeekUserCount })
    } catch (error) {
        return res.status(500).json({ status: "failure", message: "Internal server error" })
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
                    beaconDB.divisionDetails s ON o.org_id = s.org_id
                JOIN 
                    beaconDB.Beacons b ON s.div_id = b.div_id
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
            s.div_name as division_name,
            COUNT(distinct bv.user_mac) AS user_visited
            FROM 
            beaconDB.OrganizationDetails o
            JOIN 
                beaconDB.divisionDetails s ON o.org_id = s.org_id
            JOIN 
                beaconDB.Beacons b ON s.div_id = b.div_id
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
        return res.status(200).json({ status: "success", data: monthlyOrgData })
    } catch (error) {
        return res.status(404).json({ status: "failure", message: "Internal server error", Error: error.message })
    }
}

const getAllUsers = async (req, res) => {

    try {
        if (req.username === 'cit_superadmin') {
            const {count,rows} = await User.findAndCountAll({
                attributes : [`user_id`, `device_id`, `last_location`, `full_name`, `gender`, `dob`, `phone`, `email`]
            });
            if (rows) {
                return res.status(200).json({ status: "success",count:count, data: rows })
            } else {
                return res.status(404).json({ status: "failure", message: "Not found" })
            }
        } else {
            return res.status(403).json({ status: "failure", message: "Unauthorized" })
        }
    } catch (error) {
        console.log(error.message);
        
        return res.status(500).json({ status: "failure", message: "Internal server error" })
    }

}

const registerUser = async (req, res) => {
    try {
        const { password } = req.body
        const hashedPassword = await argon2.hash(password)
        console.log(hashedPassword);

        const userRegistered = await User.create({
            ...req.body,
            password: hashedPassword
        })
        if (!userRegistered) {
            return res.status(400).send({ status: "failure", message: "Error occured" })
        }
        return res.status(200).send({ status: "success", message: "User registered successfully" })
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const messages = error.errors.map(err => err.message)
            return res.status(400).send({ status: "failure", message: messages })
        }

        return res.status(500).send({ status: "failure", message: "Internal server error" })

    }
}

const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body
        const userFound = await User.findOne({
            attributes: ["email", "password"],
            where: {
                email: email,
            }
        })
        if (!userFound) {
            return res.status(200).send({ status: "failure", message: "User not found with this email" })
        }
        const verifiedPassword = await argon2.verify(userFound.password, password)
        console.log(verifiedPassword);

        if (!verifiedPassword) {
            return res.status(200).send({ status: "failure", message: "Invalid password" })
        }
        return res.status(200).send({ status: "success", message: "Login successfully" })
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            const messages = error.errors.map(err => err.message)
            return res.status(400).send({ status: "failure", message: messages })
        }
        console.log(error.message);

        return res.status(500).send({ status: "failure", message: "Internal server error" })

    }
}

const registerFCM = async (req, res) => {
    try {
        const { device_uniqueID, fcm_token } = req.body
        const userFcm = await DeviceFcmToken.findOne({
            attributes: ["fcm_token"],
            where: {
                device_id: device_uniqueID
            }
        })

        if (userFcm === null || !userFcm || userFcm.fcm_token.length === 0) {
            const createdFCM = await DeviceFcmToken.create({
                device_id: device_uniqueID,
                fcm_token: fcm_token
            })

            if (!createdFCM) {
                return res.status(400).send({ status: "failure", message: "Error occured" })
            }
            const error = await sendMessageToUser("Welcome", "you are in beacon zone ", req.body.fcm_token)
            if (error instanceof FirebaseMessagingError) {
                const errorMessages = error.errors ? error.errors.map(err => err.message) : [error.message];
                return res.status(400).json({ status: "failure", message: errorMessages });
            }
            return res.status(200).send({ status: "success", message: "FCM token created" })

        }
        if (fcm_token === userFcm.fcm_token) {
            console.log("no change area");

            const error = await sendMessageToUser("Welcome", "you are in beacon zone ", req.body.fcm_token)
            if (error instanceof FirebaseMessagingError) {
                console.log("error message area");

                const errorMessages = error.errors ? error.errors.map(err => err.message) : [error.message];
                return res.status(400).json({ status: "failure", message: errorMessages });
            }
            return res.status(200).send({ status: "success", message: "FCM token no-change" })
        }
        const fcmUpdate = await DeviceFcmToken.update({
            fcm_token: fcm_token
        }, {
            where: {
                device_id: device_uniqueID
            }
        })
        if (!fcmUpdate) {
            return res.status(400).send({ status: "failure", message: "Error occured" })
        }
        const error = await sendMessageToUser("Welcome", "you are in beacon zone ", req.body.fcm_token)
        if (error instanceof FirebaseMessagingError) {
            const errorMessages = error.errors ? error.errors.map(err => err.message) : [error.message];
            return res.status(400).json({ status: "failure", message: errorMessages });
        }
        return res.status(200).send({ status: "success", message: "FCM token updated" })
    } catch (error) {
        console.log(error);
        return false
    }
}
const viewTime = async (req, res) => {
    try {
        const bodyData = req.body
        const data = await db.sequelize.query(`
            call sp_viewTime(?,?)
            `,
            { replacements: [bodyData.user_uniqueID, bodyData.date] }
            , (err, result) => {
                if (err) {
                    return res.status(400).json({ status: "failure", message: err.message })
                } else {
                    return res.status(200).json({ status: "success", message: "sp run successfully", data: result })
                }
            }
        )
        if (data) {
            return res.status(200).json({ status: "success", data: data })
        }
        else {
            return res.status(200).json({ status: "fail", message: "data is not found" })
        }

    } catch (error) {
        return res.status(400).json({ status: "failure", message: error.message });
    }

}

const userHistory = async (req, res) => {
    try {
        const bodyData = req.body;
        const userdata = await db.sequelize.query(`
            SELECT bv.temp_id,SEC_TO_TIME( timestampdiff(second, bv.createdAt, current_timestamp()) ) as Time_Ago 
            FROM beaconDB.BeaconVisited bv INNER JOIN 
            ( SELECT temp_id,MAX(createdAt) as latestCreatedAt FROM beaconDB.BeaconVisited WHERE user_mac = ? GROUP BY temp_id )
            latest ON bv.temp_id = latest.temp_id AND bv.createdAt = latest.latestCreatedAt WHERE bv.user_mac = ? 
            order by Time_Ago;
            `,
            { replacements: [bodyData.user_uniqueID, bodyData.user_uniqueID] }
        );
        // console.log(userdata);

        if (userdata) {
            return res.status(200).json({ status: "success", data: userdata[0] })
        }
        else {
            return res.status(404).json({ status: "fail", message: "data is not found" })
        }

    } catch (error) {
        return res.status(500).json({ status: "failure", message: error.message });
    }

}

const countRegisteredUsers = async (req, res) => {
    try {
        const registeredCount = await User.count({
            attributes: ["email"]
        })
        if (!registeredCount) {
            return res.status(200).json({ status: "failure", message: "No registered users" })
        }
        return res.status(200).json({ status: "success", user_registered: registeredCount })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "failure", message: "Internal server error" });
    }
}
const sendMessageToUser = async (title, body,token) => {    
    try {
        const message = {
            notification: {
                title: title,
                body: body
            },
            token: token
        };


        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);

    } catch (error) {
        console.log(error.message);
        return error
    }
};
module.exports = {
    trackUser,
    beaconTodayUser,
    orgWeeklyUsers,
    beaconTotalUser,
    getAllUsers,
    orgMonthlyUsers,
    registerUser,
    registerFCM,
    viewTime,
    userHistory,
    countRegisteredUsers,
    loginUser
}