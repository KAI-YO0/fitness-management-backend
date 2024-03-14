const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const {
    loginController, 
    signupController,
    authController, 
    bookClassController,
    createSlipController,
    bookGroomingController, 
    getAllNotiController,
    deleteAllNotiController,
    getDetailHotelController,
    myBookingController,
    changePasswordController,
    forgotPasswordController,
    resetPasswordController,
    userEditController,
    getUserProfileController,
    classBookedController,
    isTimeBookedController,
    deleteBookingHotelController,
    sendContactController,
    myBookingGroomingController,
    deleteBookedGroomingController,
    getNewsController,
    getGallController,
    createPaymentController,
    reserveClassController,
} = require('../controller/userCtrl');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
      // cd(null, "C:/programing/fullstack/projectdraft/petegory/public/images");
      cd(null, process.env.PATH_IMAGES_FOGUS);
    },
    filename: (req, file, cd) => {
      cd(
        null,
        file.fieldname + '_' + Date.now() + path.extname(file.originalname)
      );
    },
  });
  
  const upload = multer({
    storage: storage,
  });

router.post('/login', loginController)

router.post('/signup', signupController)

//auth user
router.post('/getUserData', auth, authController)

// slip
// router.post('/createNews', auth, upload.single('filename'), createNewsController); 

//payment
router.post('/createPayment', auth ,createPaymentController)
 
//Booking Class
router.post('/reserveClass',  auth, reserveClassController)

//Booking Grooming
router.get('/isTimeBooked', auth, isTimeBookedController)
router.post('/bookGrooming', auth, bookGroomingController)

//Notification Hotel
router.post('/getNotification', auth, getAllNotiController)
router.post('/deleteNotification', auth, deleteAllNotiController)

//get detail hotels
router.get('/getDetailHotel', getDetailHotelController)

//get detail news && gallery
router.get('/getNews', getNewsController)
router.get('/getGall', getGallController);

//get history booking
router.get('/getMyBooking', auth, myBookingController)
router.delete('/deleteBookhotel/:id',auth, deleteBookingHotelController)

//get history booking Grooming
router.get('/getMyBookingGrooming', auth, myBookingGroomingController)
router.delete('/deleteBookedGrooming/:id', auth, deleteBookedGroomingController)

//reset & forgot password
router.post('/changePassword', auth , changePasswordController)
router.post('/forgotPassword', forgotPasswordController)
router.post('/resetPassword/:id/:token', resetPasswordController)

// user profile
router.get('/getUserProfile', auth, getUserProfileController)
// router.post('/editUser', auth, userEditController)

//send contact
router.post('/sendContact', auth, sendContactController)




module.exports = router;