const { UPDATE, SELECT } = require("sequelize/lib/query-types");
const db = require("../models");
const StudentRecords = db.StudentRecords;
const Beacon = db.Beacon;
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
// const Attendance = db.Attendance
// const ResetToken = db.ResetToken
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { log } = require("console");
const moment = require('moment-timezone');
const nodemailer = require('nodemailer');
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

const createStudent = async (req, res,next) => {
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

        // Prepare data for Student creation
        const dataToCreate = {
            ...req.body,
            image_path: profilePicPath || null,
            aadhar_path: aadharPath || null,
            pan_card_path: panCardPath || null
        };

        // Log data to create for debugging

        // Create student details within a transaction
        const student = await StudentRecords.create(dataToCreate, { transaction });

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
        
        if(error instanceof Sequelize.ValidationError){
            const errorMessages=error.errors.map(err=>err.message)
            return res.status(400).json({ status: 'failure', message: errorMessages });
        }
        return res.status(500).json({ status: 'error', message: 'Internal server error'})
    }
}

// student in(api)
const studentIn = async (req, res,next) => {
    // const beaconExist = await Beacon.findOne({
    //     attributes: ["beacon_id"],
    //     where: {
    //         beacon_mac: req.body.beacon_mac
    //     }
    // })
    // if (!beaconExist) {
    //     return res.status(200).json({ status: "failure", message: "Beacon not found" })
    // }
    if (!req.params.device_id) {
       const error= new CustomError('Invalid student id',400)
       return next(error)
    }
    const studentExist = await Devices.findOne({
        attributes: ["student_id"],
        where: {
            device_unique_id: req.params.device_id
        }
    })
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
    if (studentExist !== null) {
        inAttendance(studentExist.student_id, currentDate, currentTime)
        return res.status(200).json({
            status: "success",
            data: { url: "https://beacon-git-main-ac-ankurs-projects.vercel.app/dailyattendance" },
        });
    }

    return res.status(200).json({ status: "success", data: { url: "https://beacon-git-main-ac-ankurs-projects.vercel.app/registration" } });
}

// function to perform attendance-in operation 
const inAttendance = async (studentId, currentDate, currentTime) => {
    const isAlreadyAttended = await Attendance.findOne({
        attributes: ["student_id"],

        where: {
            student_id: studentId,
            date: currentDate
        }
    })
    if (!isAlreadyAttended) {
        const data = await Attendance.create({
            student_id: studentId,
            date: currentDate,
            inTime: currentTime,
        })
        return data;
    }
    return false
}
//Student out(api)
const studentOut = async (req, res) => {
    try {
        // Fetch the student_id associated with the provided device_id
        const student = await Devices.findOne({
            attributes: ['student_id'],
            where: { device_unique_id: req.body.device_id }
        });

        // If no student is found, return a 404 error
        if (!student) {
            return res.status(404).json({ status: "failure", message: "Student not found" });
        }

        // Update the outTime if it's currently null
        const [affectedRows] = await db.sequelize.query(
            `UPDATE dailyAttendances 
             SET outTime = :outTime 
             WHERE student_id = :studentID 
             AND date = :todayDate 
             AND outTime IS NULL`,
            {
                type: db.sequelize.QueryTypes.UPDATE,
                replacements: {
                    outTime: currentTime,
                    todayDate: currentDate,
                    studentID: student.student_id
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
    const data = await Attendance.findAll({
        attributes: [
            "date",
            "inTime",
            "outTime",
            [
                db.sequelize.literal(`CASE 
                    WHEN outTime IS NOT NULL AND inTime IS NOT NULL THEN 1 
                    ELSE 0 
                END`),
                'isPresent'
            ],
            [db.sequelize.fn('timediff', db.sequelize.col('outTime'), db.sequelize.col('inTime')), 'workedHours']
        ],
        where: {
            student_id: req.body.student_id,
            [db.Sequelize.Op.and]: [
                db.sequelize.where(db.sequelize.fn('month', db.sequelize.col('date')), req.body.month)
            ]
        }
    })
    if (!data) {
        return res.status(404).json({ status: "failure", message: "Student not found" })
    }
    return res.status(200).json({ status: "success", data })

}

const sendResetEmail = async (to, subject, text) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // You can use other services like 'Outlook', 'Yahoo', etc.
            auth: {
                student: process.env.EMAIL_USER, // Your email address
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

        // Check if the student exists
        const student = await StudentRecords.findOne({
            attributes: ["email", "student_id"],
            where: { email }
        });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
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

        // Update the student with the reset token and expiry
        await ResetToken.create({
            token: resetToken,
            expiry: expiryDateTime,
            student_id: student.student_id,
            createdAt: currentDateTime
        });

        // Send the reset email
        const resetLink = `${"http://localhost:3000/api"}/reset-password/${resetToken}`;
        await sendResetEmail(student.email, 'Password Reset', `Click here to reset your password: ${resetLink}`);
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
        const student = await ResetToken.findOne({
            attributes: ["student_id", "expiry"],
            where: {
                token,
                isUsed: null
            }
        })
        if (!student) {
            return res.status(404).json({ message: 'Invalid token' })
        }
        const expiry = student.expiry;
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
module.exports = {
    createStudent,
    studentIn,
    studentOut,
    getMonthlyReport,
    forgotPassword,
    resetPassword
}