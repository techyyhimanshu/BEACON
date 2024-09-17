const { UPDATE, SELECT } = require("sequelize/lib/query-types");
const db = require("../models");
const PersonnelRecords = db.PersonnelRecords;
const Sequelize = require("sequelize");
const Attendance = db.Attendance
// const ResetToken = db.ResetToken
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
const { timeStamp } = require("console");
// test comment1 for deployement



const saveFile = (fileBuffer, filePath) => {
    return new Promise((resolve, reject) => {
        if (!fileBuffer) {
            return reject(new Error("File buffer is missing"));
        }
        fs.writeFile(filePath, fileBuffer, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const createPerson = async (req, res, next) => {
    const transaction = await db.sequelize.transaction();
    try {
        // try {
        // Prepare paths for file storage but check if files are provided
        const profilePicPath = req.files['profile_pic']
            ? `uploads/profilePictures/${Date.now()}-${req.files['profile_pic'][0].originalname}`
            : null;
        const aadharPath = req.files['aadhar']
            ? `uploads/aadhar/${Date.now()}-${req.files['aadhar'][0].originalname}`
            : null;
        const panCardPath = req.files['pan_card']
            ? `uploads/pancard/${Date.now()}-${req.files['pan_card'][0].originalname}`
            : null;

        // Prepare data for Personnel creation
        const dataToCreate = {
            ...req.body,
            image_path: profilePicPath || null,
            aadhar_path: aadharPath || null,
            pan_card_path: panCardPath || null
        };

        // Log data to create for debugging

        // Create personnel details within a transaction
        const personnel = await PersonnelRecords.create(dataToCreate, { transaction });

        // Save the files to disk only if they are provided
        if (req.files['profile_pic']) {
            await saveFile(req.files['profile_pic'][0].buffer, profilePicPath);
        }
        if (req.files['aadhar']) {
            await saveFile(req.files['aadhar'][0].buffer, aadharPath);
        }
        if (req.files['pan_card']) {
            await saveFile(req.files['pan_card'][0].buffer, panCardPath);
        }

        // Commit the transaction if everything succeeded
        await transaction.commit();

        return res.status(200).json({ status: 'success', message: 'Created successfully' });
    } catch (error) {
        await transaction.rollback();
        console.log(error.message);

        if (error instanceof Sequelize.ValidationError) {
            const errorMessages = error.errors.map(err => err.message)
            return res.status(400).json({ status: 'failure', message: errorMessages });
        }
        return res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}

const getAllPersons = async (req, res) => {
    try {
        const allPerson = await PersonnelRecords.findAll({
            attributes: ["personnel_id", "name", "father_name", "dob", "email", "phone_one",
                "present_address", "isVerified"
            ],
        });
        if (allPerson) {
            return res.status(200).json({ status: 'success', data: allPerson });
        }
        else {
            return res.status(200).json({ status: 'success', message: 'no persnol user added yet' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
};

const getSinglePerson = async (req, res) => {
    try {
        const Person = await PersonnelRecords.findAll({
            attributes: ["personnel_id", "name", "father_name", "dob", "email", "phone_one", "phone_two",
                "present_address", "permanent_address", "aadhar_no", "course", "date_of_joining",
                "device_id", "image_path", "aadhar_path", "pan_card_path", "isVerified"
            ],
            where: {
                personnel_id: req.params.id
            }
        });
        if (Person) {
            return res.status(200).json({ status: 'success', data: Person });
        }
        else {
            return res.status(200).json({ status: 'success', message: 'no persnol user added yet' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}
// personnel in(api)
const personIn = async (req, res, next) => {
    const device_id = req.body.device_uniqueID
    if (!device_id) {
        return res.status(400).json({ status: 'failure', message: 'Device ID is required' })
    }
    const personnelExist = await PersonnelRecords.findOne({
        attributes: ["device_id", "personnel_id"],
        where: {
            device_id: device_id
        }
    })
    if (personnelExist !== null) {
        await inAttendance(personnelExist.personnel_id)
        return res.status(200).json({
            status: "success",
            device_id: personnelExist.device_id,
            url: "https://beacon-git-main-ac-ankurs-projects.vercel.app/dailyattendance"
        },
        );
    }

    return res.status(200).json({ status: "success", url: "https://beacon-git-main-ac-ankurs-projects.vercel.app/registration" });
}
// function to perform attendance-in operation 
const inAttendance = async (personnelId) => {
    // const isAlreadyAttended = await Attendance.findOne({
    //     attributes: ["personnel_id"],

    //     where: {
    //         personnel_id: personnelId,
    //         timestamps: currentDateTime
    //     }
    // })
    // if (!isAlreadyAttended) {
    const currentDateTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    console.log(currentDateTime);

    const data = await db.sequelize.query(`INSERT INTO DailyAttendances (personnel_id,timestamps)
VALUES (?,?);`, {
        replacements: [personnelId, currentDateTime],
        type: db.Sequelize.QueryTypes.INSERT
    })
    return data;
    // }
    // return false
}
//Personnel out(api)
const personOut = async (req, res) => {
    try {
        // Fetch the personnel_id associated with the provided device_id
        const { beacon_mac, device_id } = req.body
        const beacon = await db.Beacon.findOne({
            attributes: ["mac"],
            where: {
                mac: beacon_mac
            }
        })
        if (beacon === null) {
            return res.status(200).json({ status: "failure", message: "Beacon not found" })
        }
        if (beacon_mac !== "DC:0D:30:BD:31:C0") {
            return res.status(400).json({ status: "failure", message: "Not allowed" })
        }
        const personnel = await PersonnelRecords.findOne({
            attributes: ['personnel_id'],
            where: { device_id: device_id }
        });

        // If no personnel is found, return a 404 error
        if (!personnel) {
            return res.status(200).json({ status: "failure", message: "Person not found" });
        }
        const now = new Date();
        const currentDate = now.toLocaleString('en-CA', { timeZone: 'Asia/Kolkata' }).split(',')[0];
        const currentTime = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kolkata' });
        // Update the outTime if it's currently null
        const [affectedRows] = await db.sequelize.query(
            `UPDATE DailyAttendances 
             SET outTime = :outTime 
             WHERE personnel_id = :personnelID 
             AND date = :todayDate 
             AND outTime IS NULL`,
            {
                type: db.sequelize.QueryTypes.UPDATE,
                replacements: {
                    outTime: currentTime,
                    todayDate: currentDate,
                    personnelID: personnel.personnel_id
                }
            }
        );

        // Check if any rows were updated
        if (affectedRows === 0) {
            return res.status(400).json({ status: "failure", message: "Already done" });
        }

        // Success response
        return res.status(200).json({ status: "success", message: "Have a nice journey" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ status: "Error", message: "Internal server error" });
    }
};


const getMonthlyReport = async (req, res) => {
    const { device_id, month, year } = req.body;
    let endDate,startDate;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const currentMonth=moment().tz('Asia/Kolkata').format('MM')
    if(formattedMonth>currentMonth){
        return res.status(200).json({status:"success",data:{}})
    }    
    if (formattedMonth === currentMonth) {      
        startDate = moment(`${year}-${formattedMonth}-01`);
        endDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    }
    else {
        // Step 1: Generate full month's date range
        startDate = moment(`${year}-${formattedMonth}-01`);
        endDate = startDate.clone().endOf('month');
    }
    // const endDate = startDate.clone().endOf('month');
    console.log(startDate);


    const dateRange = [];
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
        dateRange.push(currentDate.format('YYYY-MM-DD'));
        currentDate.add(1, 'day');
    }


    // Step 2: Fetch attendance data for the given month
    const attendanceData = await db.sequelize.query(
        `SELECT d.personnel_id AS person_id, 
                DATE(d.timestamps) AS date, 
                MIN(d.timestamps) AS start, 
                MAX(d.timestamps) AS end, 
                TIMEDIFF(MAX(TIME(d.timestamps)), MIN(TIME(d.timestamps))) AS workedHours
         FROM DailyAttendances d
         JOIN PersonnelRecords p ON d.personnel_id = p.personnel_id
         WHERE p.device_id = ? 
         AND MONTH(d.timestamps) = ? 
         AND YEAR(d.timestamps) = ?
         GROUP BY DATE(d.timestamps), d.personnel_id`,
        {
            replacements: [device_id, month, year],
            type: db.sequelize.QueryTypes.SELECT,
        }
    );

    // Step 3: Map attendance data to the full month
    const report = dateRange.map((date) => {
        const attendance = attendanceData.find((entry) => entry.date === date);
        if (attendance) {
            return {
                title: "Present",
                start: attendance.start,
                end: attendance.end,
                status: "present"
            };
        } else {
            return {
                title: "Absent",
                start: `${date}T10:30:00.000Z`,
                end: `${date}T17:30:00.000Z`,
                status: "absent"
            };
        }
    });

    // Step 4: Return the final report
    return res.status(200).json({ status: "success", data: report });
};


const getTodayReport = async (req, res) => {
    const currentDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    const data = await db.sequelize.query(`SELECT  
    d.personnel_id AS person_id,
    DATE(d.timestamps) AS date,
    MIN(TIME(d.timestamps)) AS inTime,
    TIMEDIFF(MAX(d.timestamps), MIN(d.timestamps)) AS todayWorkedHours,
    TIMEDIFF('07:00:00', TIMEDIFF(MAX(d.timestamps), MIN(d.timestamps))) AS remainingTime
FROM 
    DailyAttendances d
JOIN 
    PersonnelRecords p ON d.personnel_id = p.personnel_id
WHERE 
    p.device_id = ?
    AND DATE(d.timestamps) = ?
GROUP BY 
    DATE(d.timestamps), d.personnel_id,p.device_id`, {
        replacements: [req.body.device_id, currentDate],
        type: db.sequelize.QueryTypes.SELECT
    })
    if (!data) {
        return res.status(404).json({ status: "failure", message: "Personnel not found" })
    }
    return res.status(200).json({ status: "success", data })

}


const sendResetEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use other services like 'Outlook', 'Yahoo', etc.
            auth: {
                personnel: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS  // Your email password or app-specific password
            }
        });

        // Set up email data
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to, // List of receivers
            subject, // Subject line
            text // Plain text body
            // Alternatively, you can use `html` for HTML content
            // html: `<p>${text}</p>`
        };

        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);

        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the personnel exists
        const personnel = await PersonnelRecords.findOne({
            attributes: ["email", "personnel_id"],
            where: { email }
        });
        if (!personnel) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token and expiry date
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Define the desired timezone (for example, 'Asia/Kolkata' or your local timezone)
        const timezone = 'Asia/Kolkata';

        // Get the local date and time in the desired timezone
        const now = moment().tz(timezone);
        const resetTokenExpiry = moment(now).add(15, 'minutes'); // 15 minutes from now

        // Format dates for MySQL (YYYY-MM-DD HH:MM:SS)
        const currentDateTime = now.format('YYYY-MM-DD HH:mm:ss');
        const expiryDateTime = resetTokenExpiry.format('YYYY-MM-DD HH:mm:ss');

        // Update the personnel with the reset token and expiry
        await ResetToken.create({
            token: resetToken,
            expiry: expiryDateTime,
            personnel_id: personnel.personnel_id,
            createdAt: currentDateTime
        });

        // Send the reset email
        const resetLink = `${"http://localhost:3000/api"}/reset-password/${resetToken}`;
        await sendResetEmail(personnel.email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
        return res.status(200).json({ message: 'Password reset email sent!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        const { password } = req.body;
        const personnel = await ResetToken.findOne({
            attributes: ["personnel_id", "expiry"],
            where: {
                token,
                isUsed: null
            }
        })
        if (!personnel) {
            return res.status(404).json({ message: 'Invalid token' })
        }
        const expiry = personnel.expiry;
        const now = new Date();
        const expiryDate = new Date(expiry);
        if (now > expiryDate) {
            return res.status(404).json({ message: 'Token has expired' })
        }
        await ResetToken.update({
            isUsed: true
        }, {
            where: { token }
        })
        return res.status(200).json({ message: 'Password reset successfull' })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
const VerifyPerson = async (req, res) => {
    try {
        const Person = await PersonnelRecords.update({
            isVerified: true
        }, {
            where: {
                personnel_id: req.params.id
            }
        });
        if (Person) {
            return res.status(200).json({ status: 'success', message: `Person ID :${req.params.id} is verified successfully` });
        }
        else {
            return res.status(200).json({ status: 'success', message: 'person is not verified' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: 'error', message: 'Internal server error' })
    }
}
module.exports = {
    createPerson,
    personIn,
    personOut,
    getMonthlyReport,
    forgotPassword,
    resetPassword,
    getAllPersons,
    getSinglePerson,
    VerifyPerson,
    getTodayReport

}