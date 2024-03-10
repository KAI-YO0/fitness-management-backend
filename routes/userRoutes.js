const express = require('express')
const {
    loginController, 
    signupController,
    authController, 
    bookClassController,
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
    paymentController,
} = require('../controller/userCtrl');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post('/login', loginController)

router.post('/signup', signupController)

//auth user
router.post('/getUserData', auth, authController)

//Booking Class
router.get('/classBooked', auth, classBookedController)
router.post('/bookClass', auth, bookClassController)

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
router.post('/editUser', auth, userEditController)

//send contact
router.post('/sendContact', auth, sendContactController)

//payment
router.post('/payment', auth,  paymentController)


module.exports = router;