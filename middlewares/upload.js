const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + (Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

exports.upload = multer({ storage: storage }).single('file')
