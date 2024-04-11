const multer = require("multer");

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for storing
  },
});

export const upload = multer({ storage: storage });
