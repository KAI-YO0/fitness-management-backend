const userModel = require("../models/userModels");
const classModel = require("../models/classModels");
const classHasUserModel = require("../models/classHasUserModels");
const hotelDetailModel = require("../models/hotelDetailModel");
const employeeModel = require("../models/employeeModel");
const hotelModel = require("../models/hotelModel");
const groomingModel = require("../models/groomingModel");
const newsModel = require("../models/newsModel");
const galleryModel = require("../models/galleryModel");
const path = require("path");



// Get All User

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({ role: { $nin: ["admin"] } });
    res.status(200).send({
      success: true,
      message: "รายชื่อผู้ใช้",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ไม่พบข้อมูล",
      error,
    });
  }
};

// Get All Employee

const getAllEmployeeController = async (req, res) => {
  try {
    const employees = await userModel.find({ role: "employee" });
    res.status(200).send({
      success: true,
      message: "รายชื่อพนักงาน",
      data: employees,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ไม่พบข้อมูล",
      error,
    });
  }
};

// Get All Trainer

const getAllTrainerController = async (req, res) => {
  try {
    const trainers = await userModel.find({ role: "trainer" });
    res.status(200).send({
      success: true,
      message: "รายชื่อเทรนเนอร์",
      data: trainers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ไม่พบข้อมูล",
      error,
    });
  }
};

// Create  Classes

const createClassController = async (req, res) => {
  try {
    const newClass = new classModel({
      userId: req.body.userId,
      name: req.body.name,
      description: req.body.description,
      motivations: req.body.motivations,
      intensity: req.body.intensity,
      minute: req.body.minute,
      date: req.body.date,
    });
    await newClass.save();
    res.status(201).send({ message: "สร้างคลาสสำเร็จ", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `${error.message}`,
    });
  }
};

// Book Class

const bookClassController = async (req, res) => {
  const classId = req.header('classId');
  const { userId } = req.body;

  try {
    // Find the class by ID
    const existingClass = await classModel.findById(classId);

    if (!existingClass) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    // Find the user by their ID
    const userToAdd = await userModel.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create a new entry in the classHasUser model
    const classHasUserEntry = new classHasUserModel({
      classId: existingClass._id,
      userId: userToAdd._id,
    });

    // Save the classHasUser entry
    await classHasUserEntry.save();

    // Add the user to the class
    if (existingClass.users) {
      existingClass.users.push(userToAdd._id);
    } else {
      existingClass.users = [userToAdd._id];
    }
    
    await existingClass.save();

    res.status(200).json({ success: true, message: 'User added to the class successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Edit Role User
// const editRoleUserController = async (req, res) => {
//   try {
//     // const id = req.header('userId');
//     const id = req.params.id;
//     const user = await userModel.findById({ _id: id });

//     if (user) {
//       res.status(200).send({
//         success: true,
//         message: "ดึงข้อมูลผู้ใช้สำเร็จ",
//         data: user,
//       });
//     } else {
//       res.status(404).send({
//         success: false,
//         message: "ไม่พบผู้ใช้",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
//     });
//   }
// };

const editRoleUserController = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await userModel.findById({ _id: id });

    if (user) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลผู้ใช้สำเร็จ",
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
    });
  }
};

// Update Role User
// const updateRoleUserController = async (req, res) => {
//   try {
//     const id = req.header('userId');
//     const {role} = req.body;
//     const updateUser = await userModel.findByIdAndUpdate(
//       { _id: id },
//       {role}
//     );
//     res.status(200).send({
//       success: true,
//       message: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
//       data: updateUser,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "แก้ไขข้อมูลผู้ใช้ไม่สำเร็จ",
//     });
//   }
// };

const updateRoleUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const { role } = req.body; // เฉพาะ role ที่ต้องการอัปเดต

    // ใช้ findByIdAndUpdate เพื่ออัปเดตเฉพาะฟิลด์ role เท่านั้น
    const updateUser = await userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true } // ตั้งค่า new เป็น true เพื่อให้ MongoDB ส่งค่าของเอกสารหลังจากการอัปเดตกลับมา
    );

    // ตรวจสอบว่ามีผู้ใช้หรือไม่
    if (!updateUser) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }

    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลผู้ใช้สำเร็จ",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลผู้ใช้ไม่สำเร็จ",
    });
  }
};

// Delete User
const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลผู้ใช้สำเร็จ",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ลบข้อมูลผู้ใช้ไม่สำเร็จ",
      error,
    });
  }
};


const editNewsController = async (req, res) => {
  try {
    const id = req.params.id;

    const news = await newsModel.findById({ _id: id });

    if (news) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        data: news,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลผิดพลาด",
    });
  }
};

const updateNewsController = async (req, res) => {
  try {
    const id = req.params.id;

    let updateFields = {};
    if (req.file) {
      updateFields.image = req.file.filename;
    }
    const updateNews = await newsModel.findByIdAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateNews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};

const deleteNewsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await newsModel.findByIdAndDelete({ _id: userId });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: user,
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

const getNewsController = async (req, res) => {
  try {
    const detail = await newsModel.find({});
    res.status(200).send({
      success: true,
      message: "ข่าวสารทั้งหมด",
      data: detail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ไม่พบข้อมูล",
      error,
    });
  }
};

const createGallController = async (req, res) => {
  try {
    await galleryModel.create({
      image: req.file.filename,
    });
    res.status(200).send({
      success: true,
      message: "เพิ่มข้อมูลสำเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "เพิ่มข้อมูลไม่สำเร็จ",
      error,
    });
  }
};

const editGallController = async (req, res) => {
  try {
    const id = req.params.id;

    const gallery = await galleryModel.findById({ _id: id });

    if (gallery) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลรูปภาพสำเร็จ",
        data: gallery,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลรูปภาพไม่สำเร็จ",
    });
  }
};

const updateGallController = async (req, res) => {
  try {
    const id = req.params.id;

    let updateFields = {};
    if (req.file) {
      updateFields.image = req.file.filename;
    }
    const updateGallery = await galleryModel.findByIdAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateGallery,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};

const deleteGallController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await galleryModel.findByIdAndDelete({ _id: userId });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: user,
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

const getGallController = async (req, res) => {
  try {
    const detail = await galleryModel.find({});
    res.status(200).send({
      success: true,
      message: "ดึงข้อมูลสำเร็จ",
      data: detail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
      error,
    });
  }
};

const createHotelController = async (req, res) => {
  try {
    await hotelDetailModel.create({
      type: req.body.type,
      price: req.body.price,
      title1: req.body.title1,
      title2: req.body.title2,
      title3: req.body.title3,
      title4: req.body.title4,
      title5: req.body.title5,
      image: req.file.filename,
    });
    res.status(200).send({
      success: true,
      message: "เพิ่มข้อมูลสำเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "เพิ่มข้อมูลไม่สำเร็จ",
      error,
    });
  }
};

const getHotelController = async (req, res) => {
  try {
    const detail = await hotelDetailModel.find({});
    res.status(200).send({
      success: true,
      message: "ข้อมูลโรงแรมทั้งหมด",
      data: detail,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
      error,
    });
  }
};

const editHotelController = async (req, res) => {
  try {
    const id = req.params.id;

    const hotel = await hotelDetailModel.findById({ _id: id });

    if (hotel) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        data: hotel,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
    });
  }
};

const updateHotelController = async (req, res) => {
  try {
    const id = req.params.id;
    const { type, price, title1, title2, title3, title4, title5 } = req.body;

    let updateFields = {
      type,
      price,
      title1,
      title2,
      title3,
      title4,
      title5,
    };
    if (req.file) {
      updateFields.image = req.file.filename;
    }
    const updateHotel = await hotelDetailModel.findByIdAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateHotel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};

const deleteHotelsController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await hotelDetailModel.findByIdAndDelete({ _id: userId });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: user,
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

const getUserCountController = async (req, res) => {
  try {
    const userCount = await userModel
      .findOne({ role: "member" })
      .countDocuments();

    res.status(200).send({
      success: true,
      message: "จำนวนผู้ใช้ทั้งหมด",
      data: userCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
      error,
    });
  }
};

//CountTrainer
const getTrainerCountController = async (req, res) => {
  try {
    const userCount = await userModel
      .findOne({ role: "trainer" })
      .countDocuments();

    res.status(200).send({
      success: true,
      message: "จำนวนผู้ใช้ทั้งหมด",
      data: userCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
      error,
    });
  }
};

//CountAlluser
const getAlluserCountController = async (req, res) => {
  try {
    const userCount = await userModel.countDocuments({
      $or: [
        { role: "trainer" },
        { role: "member" },
        { role: "employee" },
      ]
    })

    res.status(200).send({
      success: true,
      message: "จำนวนผู้ใช้ทั้งหมด",
      data: userCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
      error,
    });
  }
};

const getBookHotelCountController = async (req, res) => {
  try {
    const BookingHotelCount = await hotelModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "จำนวนการจองโรงแรมทั้งหมด",
      data: BookingHotelCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลการจองโรงแรมไม่สำเร็จ",
      error,
    });
  }
};

const getBookGroomingCountController = async (req, res) => {
  try {
    const BookingGroomingCount = await groomingModel.countDocuments();

    res.status(200).send({
      success: true,
      message: "จำนวนการจอง grooming ทั้งหมด",
      data: BookingGroomingCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลการจอง grooming ไม่สำเร็จ",
      error,
    });
  }
};

const changeStatusController = async (req, res) => {
  try {
    const { isEmployee } = req.body;
    const user = await userModel.findById(isEmployee);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบผู้ใช้",
      });
    }
    if (isEmployee) {
      user.isEmployee = true;
    }
    await user.save();

    res.status(201).send({
      success: true,
      message: "เปลี่ยนสถานะผู้ใช้แล้ว",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "เปลี่ยนสถานะไม่สำเร็จ",
      error,
    });
  }
};

const statusBookHotelController = async (req, res) => {
  try {
    const { status } = req.body;
    const bookHotel = await hotelModel.findByIdAndUpdate(status);

    if (!bookHotel) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูลการจอง",
      });
    }

    if (bookHotel.status === "pending") {
      bookHotel.status = "success";

      await bookHotel.save();

      res.status(201).send({
        success: true,
        message: "แก้ไขสถานะแล้ว",
        data: bookHotel,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "สถานะไม่ถูกแก้ไข",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขสถานะไม่สำเร็จ",
      error,
    });
  }
};
const statusBookGroomingController = async (req, res) => {
  try {
    const { status } = req.body;
    const bookGrooming = await groomingModel.findByIdAndUpdate(status);

    if (!bookGrooming) {
      return res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }

    if (bookGrooming.status === "pending") {
      bookGrooming.status = "success";

      await bookGrooming.save();

      res.status(201).send({
        success: true,
        message: "แก้ไขสถานะแล้ว",
        data: bookGrooming,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "สถานะไม่ถูกแก้ไข",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขสถานะไม่สำเร็จ",
      error,
    });
  }
};

// const editUserController = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const user = await userModel.findById({ _id: id });

//     if (user) {
//       res.status(200).send({
//         success: true,
//         message: "ดึงข้อมูลผู้ใช้สำเร็จ",
//         data: user,
//       });
//     } else {
//       res.status(404).send({
//         success: false,
//         message: "ไม่พบผู้ใช้",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "ดึงข้อมูลผู้ใช้ไม่สำเร็จ",
//     });
//   }
// };

// const updateUserController = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { role } = req.body; // เฉพาะ role ที่ต้องการอัปเดต


// const editEmployeeController = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const user = await userModel.findById({ _id: id });

//     if (user) {
//       res.status(200).send({
//         success: true,
//         message: "ดึงข้อมูลพนักงานสำเร็จ",
//         data: user,
//       });
//     } else {
//       res.status(404).send({
//         success: false,
//         message: "ไม่พบข้อมูลพนักงาน",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "ดึงข้อมูลพนักงานไม่สำเร็จ",
//     });
//   }
// };

const updateEmployeeController = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, role } = req.body;
    const updateUser = await userModel.findByIdAndUpdate(
      { _id: id },
      { name, email, phone, role }
    );
    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};
const getAllbookingHotelsController = async (req, res) => {
  try {
    const user = await hotelModel.find();
    user.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).send({
      success: true,
      message: "ประวัติการจองโรงแรมทั้งหมด",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ไม่พบข้อมูล",
      error,
    });
  }
};

const editBookHotelController = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await hotelModel.findOne(
      { _id: userId },
      { userId: 1, _id: 0, time: 1, startDate: 1, endDate: 1 }
    );

    if (user) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
    });
  }
};

const updateBookHotelController = async (req, res) => {
  try {
    const id = req.params.id;
    const { startDate, endDate, time } = req.body;
    const updateUser = await hotelModel.findByIdAndUpdate(
      { _id: id },
      { startDate, endDate, time }
    );
    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};

const deleteBookHotelController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await hotelModel.findByIdAndDelete({ _id: userId });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: user,
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

const getAllbookingGroomingController = async (req, res) => {
  try {
    const user = await groomingModel.find();
    user.sort((a, b) => b.createdAt - a.createdAt);
    res.status(200).send({
      success: true,
      message: "ดึงข้อมูลสำเร็จ",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
      error,
    });
  }
};
const editBookGroomingController = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await groomingModel.findOne(
      { _id: userId },
      { userId: 1, _id: 0, time: 1, date: 1, grooming: 1, addon: 1 }
    );

    if (user) {
      res.status(200).send({
        success: true,
        message: "ดึงข้อมูลสำเร็จ",
        data: user,
      });
    } else {
      res.status(404).send({
        success: false,
        message: "ไม่พบข้อมูล",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "ดึงข้อมูลไม่สำเร็จ",
    });
  }
};

const updateBookGroomingController = async (req, res) => {
  try {
    const id = req.params.id;
    const { date, time, grooming, addon } = req.body;
    const updateUser = await groomingModel.findByIdAndUpdate(
      { _id: id },
      { date, time, grooming, addon }
    );
    res.status(200).send({
      success: true,
      message: "แก้ไขข้อมูลสำเร็จ",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "แก้ไขข้อมูลไม่สำเร็จ",
    });
  }
};
const deleteBookedGroomingController = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await groomingModel.findByIdAndDelete({ _id: userId });
    res.status(200).send({
      success: true,
      message: "ลบข้อมูลสำเร็จ",
      data: user,
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

const getBookingHistory = async () => {
  try {
    const hotelBookings = await hotelModel.find({ status: "pending" });
    const groomingBookings = await groomingModel.find({ status: "pending" });

    const bookingHistory = [...hotelBookings, ...groomingBookings];

    bookingHistory.sort((a, b) => b.createdAt - a.createdAt);

    return bookingHistory;
  } catch (error) {
    throw error;
  }
};
const sendBookingHistory = async (req, res) => {
  try {
    const bookingHistory = await getBookingHistory();
    return res.status(200).send({ success: true, data: bookingHistory });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: "พบข้อผิดพลาด" });
  }
};

module.exports = {
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
  // editUserController,
  // updateUserController,
  // deleteUserController,
  // editEmployeeController,
  updateEmployeeController,
  getAllbookingHotelsController,
  editBookHotelController,
  updateBookHotelController,
  deleteBookHotelController,
  getAllbookingGroomingController,
  editBookGroomingController,
  updateBookGroomingController,
  deleteBookedGroomingController,
  sendBookingHistory,
  // createNewsController,
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
}