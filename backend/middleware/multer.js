import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploads"); // Make sure this directory exists
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

// File filter function to restrict file types
const fileFilter = (req, file, callback) => {
  if (file.fieldname === "image") {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(new Error("Only image files are allowed for the project image!"), false);
    }
  } else if (file.fieldname === "projectFiles") {
    if (
      file.mimetype === "application/zip" || 
      file.mimetype === "application/x-zip-compressed" ||
      file.mimetype === "application/octet-stream"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Project files must be in ZIP format!"), false);
    }
  } else if (file.fieldname === "documentation") {
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/octet-stream"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Documentation must be in PDF format!"), false);
    }
  } else {
    callback(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB file size limit
  }
});

export const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "projectFiles", maxCount: 1 },
  { name: "documentation", maxCount: 1 }
]);

// Create uploads directory if it doesn't exist
import fs from "fs";
try {
  if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
  }
} catch (err) {
  console.error("Error creating uploads directory:", err);
}

export default uploadFields;
