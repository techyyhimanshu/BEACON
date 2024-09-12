const { Router } = require('express');
const multer = require('multer');
const { createPerson,personOut,getMonthlyReport, getAllPersons,getSinglePerson,VerifyPerson,
  forgotPassword, resetPassword} = require('../controllers/personnelController');
const router = Router();
const verifyToken = require('../middlewares/authMiddleware');

// Define the file filter (if needed)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif','application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type.'), false); // Reject the file
  }
};
// Middleware to handle multer errors
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        res.status(400).json({ status: 'failure', message: err.message });
    } else if (err) {
        // Other errors
        res.status(400).json({ status: 'failure', message: err.message });
    } else {
        // Pass to the next middleware
        next();
    }
};
const upload = multer({ fileFilter });

router.post('/api/person',upload.fields([
  { name: 'profile_pic', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 },
  { name: 'pan_card', maxCount: 1 }
]),createPerson);

// router.get("/api/person/in/:device_id?",personIn)
router.post("/api/person/out",personOut)
router.post("/api/person/report/monthly",getMonthlyReport)
router.post("/api/person/forgot/password",forgotPassword)
router.post("/api/reset-password/:token?",resetPassword)
router.get("/api/person/:id?",getSinglePerson)
router.get("/api/persons",getAllPersons)
router.get("/api/person/:id?/verify",verifyToken,VerifyPerson)



module.exports = router;