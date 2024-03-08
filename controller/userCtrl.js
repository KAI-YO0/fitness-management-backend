const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const classModel = require("../models/classModels");
const hoteldetailModel = require("../models/hotelDetailModel");
const groomingModel = require("../models/groomingModel");
const contactModel = require("../models/contactModel");
// const employeeModel = require("../models/employeeModel");
const newsModel = require("../models/newsModel");
const galleryModel = require("../models/galleryModel");
// const moment = require("moment");
const nodemailer = require("nodemailer");

// const { notifyLine } = require("../Functions/Notify");
// const tokenLine = "5Ir6hjUjIQ6374TGO91Fv1DA7ewZlh5UQodcI8DU65N";


// register
const signupController = async (req, res) => {
  try {
    const exisitingUser = await userModel.findOne({ username: req.body.username });
    if (exisitingUser) {
      return res
        .status(200)
        .send({ message: "มีผู้ใช้นี้แล้ว", success: false });
    }
    const password = await req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      id_card: req.body.id_card,
      phone_number: req.body.phone_number,
      address: req.body.address,
      sex: req.body.sex,
      // image_url: req.body.image_url,
      // member_id: req.body.member_id,
      // role: req.body.role,
      // isMember: req.body.isMember,
      // isAdmin: req.body.isAdmin,
      // isEmployee: req.body.isEmployee,
      // isTrainer: req.body.isTrainer,


    });
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(200)
        .send({ message: "ไม่พบผู้ใช้", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "รหัสผ่านไม่ถูกต้อง", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({ message: "Login Success", success: true, token , user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "ไม่พบผู้ใช้",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

// Reset password 

const changePasswordController = async (req, res) => {
  const userId = req.body.userId;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "รหัสผ่านเก่าไม่ถูกต้อง", success: false });
    }
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).swnd({ message: "ไม่สามารถเปลี่ยนรหัสผ่านได้", success: false });
  }
};

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  await userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return res.send({ message: "ไม่พบผู้ใช้" });
      }
      const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
        expiresIn: "1d",
      });
      var transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        auth: {
          user: "tanapumin.fo@gmail.com",
          pass: "umvsulynvqfehyde",
        },
      });

      var mailOptions = {
        from: "tanapumin.fo@gmail.com",
        to: email,
        subject: "Reset Password Link",
        text: `http://localhost:3000/reset-password/${user._id}/${token}`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Email send error:", error);
        } else {
          console.log("Email sent:", info.response);
          return res.send({ success: true });
        }
      });
      return res.send({ success: true });
    })
    .catch((error) => {
      console.log(error);
      return res.send({ message: "เกิดข้อผิดพลาด" });
    });
};

const resetPasswordController = (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, "jwt_secret_key", (err, decode) => {
    if (err) {
      return res.send({
        success: false,
        message: "Error with token",
      });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          userModel
            .findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ success: true }))
            .catch((err) =>
              res.send({
                success: false,
                message: "Hash Error",
              })
            );
        })
        .catch((err) =>
          res.send({
            success: false,
            message: "Error to hash reset",
          })
        );
    }
  });
};

// Get User by ID

const getUserProfileController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    res.status(200).send({
      success: true,
      message: "get user detail",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "get user error",
    });
  }
};

// Edit User by ID

const userEditController = async (req, res) => {
  const { username, password , email , firstname , lastname , id_card ,  phone_number ,
    address , sex , role , member_id } = req.body;
  try {
    const user = await userModel.findOneAndUpdate(
      { _id: req.body.userId },
      { username, password , email , firstname , lastname , id_card ,  phone_number ,
        address , sex , role , member_id }
    );
    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};



const classBookedController = async (req, res) => {
  const { name, description, startDate, endDate } = req.query;

  try {
    const classBooked = await classBooked(
      name,
      description,
      startDate,
      endDate
    );
    res.status(200).json({ classBooked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

const bookClassController = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (
      await isRoomBooked(
        req.body.name,
        req.body.description,
        req.body.startDate,
        req.body.endDate
      )
    ) {
      return res.status(400).send({
        success: false,
        message: "คลาสนี้ถูกจองแล้ว",
      });
    }

    const newClass = await classModel({
      ...req.body,
      userId: userId,
      status: "pending",
    });
    await newClass.save();

    const adminUser = await userModel.find({ role : "admin" });
    const employeeUsers = await userModel.find({ role: "employee" });

    const notificationAdmin = {
      type: "class-booking-request",
      message: `มีการจองคลาสออกกำลังกาย
      Name: ${newClass.name}
      Description: ${newClass.description}
      Motivations: ${newClass.motivations}
      Intensity: ${newClass.intensity}
      Minute: ${newClass.minute}
      Date: ${newClass.startDate} - ${newClass.endDate}
      Check-in Time: ${newClass.time} `,
      data: {
        classId: newClass._id,
        name: newClass.name,
        onClickPath: "/admin/dashboard/class",
      },
    };

    ad.notification.push(notificationAdmin);
    await adminUser.save();

    if (!employeeUsers) {
      console.log("Employee user not found.");
    } else {
      for (const employeeUser of employeeUsers) {
        const notificationEmployee = {
          type: "hotel-booking-request",
          message: `มีการจองคลาสออกกำลังกาย
          Name: ${newClass.name}
          Description: ${newClass.description}
          Motivations: ${newClass.motivations}
          Intensity: ${newClass.intensity}
          Minute: ${newClass.minute}
          Date: ${newClass.startDate} - ${newClass.endDate}
          Check-in Time: ${newClass.time} `,
          data: {
            classId: newClass._id,
            name: newClass.name,
            onClickPath: "/admin/dashboard/class",
          },
        };

        employeeUser.notification.push(notificationEmployee);
        await employeeUser.save();
        console.log("Employee user found:", employeeUsers);
      }
    }

    // Update notification for admin
    await userModel.findOneAndUpdate(
      { _id: adminUser._id },
      { $push: { notification: notificationAdmin } }
    );

    res.status(201).send({
      success: true,
      message: "จองสำเร็จ",
    });


  } catch (error) {
    console.log(error);
    //
    if (error.code === 11000) {
      return res.status(400).send({
        success: false,
        message: "คลาสนี้ถูกจองแล้ว",
      });
    }
    //
    res.status(500).send({
      success: false,
      error,
      message: "ไม่สามารถจองได้",
    });
  }
};







const isTimeBooked = async (time, date) => {
  try {
    const existingBooking = await groomingModel.findOne({
      time,
      date,
    });
    return !!existingBooking;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const isTimeBookedController = async (req, res) => {
  const { time, date } = req.query;

  try {
    const bookedTimeSlots = await isTimeBooked(time, date);
    res.status(200).send({ bookedTimeSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาด" });
  }
};

const bookGroomingController = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { time, date, grooming } = req.body;
    const isTimeAlreadyBooked = await isTimeBooked(time, date, grooming);
    if (isTimeAlreadyBooked) {
      res.status(400).send({
        success: false,
        message: "เวลานี้ถูกจองแล้ว",
      });
      return;
    }

    const newGrooming = await groomingModel({
      ...req.body,
      userId: userId,
      status: "pending",
      // date: moment(date, 'DD-MM-YYYY').format('DD-MM-YYYY'),
    });
    await newGrooming.save();

    const adminUser = await userModel.findOne({ role :"admin" });
    const employeeUsers = await userModel.find({ role: "employee" });
    // const formatDate = moment(newGrooming.date).format("DD-MM-YYYY");

    const notificationAdmin = {
      type: "grooming-booking-request",
      message: `มีการจองคลาสออกกำลังกาย
      Name: ${newGrooming.Name}
      Petname: ${newGrooming.PetName}
      Type_pet: ${newGrooming.pet_type}
      Add-on: ${newGrooming.addon}
      Breed: ${newGrooming.breed}
      Service: ${newGrooming.grooming}
      Date: ${newGrooming.date}
      Time: ${newGrooming.time}`,
      data: {
        groomingId: newGrooming._id,
        name: newGrooming.PetName,
        onClickPath: "/admin/dashboard/grooming",
      },
    };
    adminUser.notification.push(notificationAdmin);
    await adminUser.save();

    if (!employeeUsers) {
      console.log("Employee user not found.");
    } else {
      for (const employeeUser of employeeUsers) {
        const notificationEmployee = {
          type: "grooming-booking-request",
          message: `มีการจองอาบน้ำ-ตัดขน
          Name: ${newGrooming.Name}
          Petname: ${newGrooming.PetName}
          Type_pet: ${newGrooming.pet_type}
          Add-on: ${newGrooming.addon}
          Breed: ${newGrooming.breed}
          Service: ${newGrooming.grooming}
          Date: ${newGrooming.date}
          Time: ${newGrooming.time}`,
          data: {
            groomingId: newGrooming._id,
            name: newGrooming.PetName,
            onClickPath: "/admin/dashboard/grooming",
          },
        };

        employeeUser.notification.push(notificationEmployee);
        await employeeUser.save();
        console.log("Employee user found:", employeeUsers);
      }
    }

    //update notification
    await userModel.findOneAndUpdate(
      { _id: adminUser._id },
      { $push: { notification: notificationAdmin } }
    );
    res.status(201).send({
      success: true,
      message: "จองสำเร็จแล้ว",
    });
    //notify
    const text = notificationAdmin.message;
    await notifyLine(tokenLine, text);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "ไม่สามารถจองได้",
    });
  }
};

const isRoomBooked = async (name, description, startDate, endDate) => {
  try {
    const existingBooking = await classModel.findOne({
      $or: [
        {
          $and: [
            { startDate: { $lte: startDate } },
            { endDate: { $gte: startDate } },
          ],
        },
        {
          $and: [
            { startDate: { $lte: endDate } },
            { endDate: { $gte: endDate } },
          ],
        },
      ],
      name,
      description,
    });
    return !!existingBooking;
  } catch (error) {
    console.error(error);
    return false;
  }
};




const getAllNotiController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    const seenotification = user.seenotification;
    const notification = user.notification;

    seenotification.push(...notification);

    user.notification = [];
    user.seenotification = notification;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

const deleteAllNotiController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seenotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

const getDetailHotelController = async (req, res) => {
  try {
    const detail = await hoteldetailModel.find({});
    res.status(200).send({
      success: true,
      message: "details data list",
      data: detail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching details",
      error,
    });
  }
};

const myBookingController = async (req, res) => {
  try {
    const loggedInUserId = req.body.userId;
    const userBookings = await hotelModel.find({ userId: loggedInUserId });
    res.status(200).send({
      success: true,
      message: "details booking list",
      data: userBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching details",
      error,
    });
  }
};

const deleteBookingHotelController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBooking = await hotelModel.findByIdAndDelete({ _id: id });
    if (!deletedBooking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: deletedBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ลบข้อมูลไม่สำเร็จ",
      error,
    });
  }
};

const myBookingGroomingController = async (req, res) => {
  try {
    const loggedInUserId = req.body.userId;
    const userBookings = await groomingModel.find({ userId: loggedInUserId });
    res.status(200).send({
      success: true,
      message: "details booking list",
      data: userBookings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching details",
      error,
    });
  }
};

const deleteBookedGroomingController = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBooking = await groomingModel.findByIdAndDelete({ _id: id });
    if (!deletedBooking) {
      return res.status(404).send({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: deletedBooking,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ลบข้อมูลไม่สำเร็จ",
      error,
    });
  }
};





const sendContactController = async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const contact = await contactModel.create({ name, email, message });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: "tanapumin.fo@gmail.com",
        pass: "umvsulynvqfehyde",
      },
    });

    var mailOptions = {
      from: email,
      to: "tanapumin.fo@gmail.com",
      subject: "Contact from petegory website",
      text: email + "\n" + "จาก " + name + "\n" + message,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Email send error:", error);
      } else {
        console.log("Email sent:", info.response);
        return res.send({ success: true, data: contact });
      }
    });
    return res.send({ success: true });
  } catch (error) {
    console.log(error);
    return res.send({ message: "เกิดข้อผิดพลาด" });
  }
};

const getNewsController = async (req, res) => {
  try {
    const news = await newsModel.find();
    res.status(200).send({
      success: true,
      message: "get news success",
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error to get News",
    });
  }
};

const getGallController = async (req, res) => {
  try {
    const detail = await galleryModel.find();
    res.status(200).send({
      success: true,
      message: "details data list",
      data: detail,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "error while fetching details",
    });
  }
};


module.exports = {

  signupController,
  loginController,
  authController,

  changePasswordController,
  forgotPasswordController,
  resetPasswordController,

  getUserProfileController,
  userEditController,

  classBookedController,
  bookClassController,

  bookGroomingController,
  getAllNotiController,
  deleteAllNotiController,
  getDetailHotelController,
  myBookingController,
  
  isRoomBooked,
  isTimeBookedController,
  
  deleteBookingHotelController,
  sendContactController,
  myBookingGroomingController,
  deleteBookedGroomingController,
  getNewsController,
  getGallController,
  // createClassController
};
