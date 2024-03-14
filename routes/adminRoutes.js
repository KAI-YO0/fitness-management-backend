const express = require('express');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllUsersController,
  getAllEmployeeController,
  getAllTrainerController,
  createClassController,
  bookClassController,
  editRoleUserController,
  updateRoleUserController,
  deleteUserController,


  createHotelController,
  getHotelController,
  editHotelController,
  updateHotelController,
  deleteHotelsController,
  getUserCountController,
  getBookHotelCountController,
  getBookGroomingCountController,
  changeStatusController,
  statusBookHotelController,
  statusBookGroomingController,
  editEmployeeController,
  updateEmployeeController,
  getAllbookingHotelsController,
  editBookHotelController,
  updateBookHotelController,
  deleteBookHotelController,
  getAllbookingGroomingController,
  deleteBookedGroomingController,
  editBookGroomingController,
  updateBookGroomingController,
  sendBookingHistory,
  createNewsController,
  getNewsController,
  deleteNewsController,
  editNewsController,
  updateNewsController,
  createGallController,
  getGallController,
  editGallController,
  updateGallController,
  deleteGallController,
  getTrainerCountController,
  getAlluserCountController,

} = require('../controller/adminCtrl');

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

//get user&employee
router.get('/getAllUsers', auth, getAllUsersController);
router.get('/getAllEmployees', auth, getAllEmployeeController);
router.get('/getAllTrainers', auth, getAllTrainerController);

// class
router.post('/createClasses', auth, createClassController);
router.post('/bookClasses', auth, bookClassController);

//admin get users
router.get('/editUser/:id', auth, editRoleUserController);
router.put('/updateUser/:id', auth, updateRoleUserController);
router.delete('/deleteUser/:id', auth, deleteUserController);

//news
// router.post('/createNews', auth, upload.single('filename'), createNewsController);
router.get('/getNews', auth, getNewsController);
router.get('/editNews/:id', auth, editNewsController);
router.put('/updateNews/:id', auth, upload.single('filename'), updateNewsController);
router.delete('/deleteNews/:id', auth, deleteNewsController);

//gallery
router.post('/createGall', auth, upload.single('filename'), createGallController);
router.get('/getGall', auth, getGallController);
router.get('/editGall/:id', auth, editGallController);
router.put('/updateGall/:id', auth, upload.single('filename'), updateGallController);
router.delete('/deleteGall/:id', auth, deleteGallController);

// hotel details
router.post('/createHotels', auth, upload.single('filename'), createHotelController);
router.get('/getHotels', auth, getHotelController);
router.get('/editHotel/:id', auth, editHotelController);
router.put('/updateHotel/:id', auth, upload.single('filename'), updateHotelController);
router.delete('/deleteHotels/:id', auth, deleteHotelsController);

//all booking dashboard
router.get('/getBookingHistory', auth, sendBookingHistory);

//count dashboard
router.get('/getUserCount', auth, getUserCountController);
router.get('/getTrainerCount', auth, getTrainerCountController);
router.get('/getAlluserCount', auth, getAlluserCountController);
router.get('/getBookHotelCount', auth, getBookHotelCountController);
router.get('/getBookGroomingCount', auth, getBookGroomingCountController);


//Booking Grooming
router.get('/allBookedGrooming', auth, getAllbookingGroomingController);
router.delete('/deleteBookedGrooming/:id', auth, deleteBookedGroomingController);
router.get('/editBookGrooming/:id', auth, editBookGroomingController);
router.put('/updateBookGrooming/:id', auth, updateBookGroomingController);

//change status
router.post('/changeStatus', auth, changeStatusController);
router.post('/statusBookHotel', auth, statusBookHotelController);
router.post('/statusBookGrooming', auth, statusBookGroomingController);

//admin get employees
// router.get('/editEmployee/:id', auth, editEmployeeController);
router.put('/updateEmployee/:id', auth, updateEmployeeController);

//Booking Hotel
router.get('/allBookedHotel', auth, getAllbookingHotelsController);
router.get('/editBookHotel/:id', auth, editBookHotelController);
router.put('/updateBookHotel/:id', auth, updateBookHotelController);
router.delete('/deleteBookHotel/:id', auth, deleteBookHotelController);

module.exports = router;
