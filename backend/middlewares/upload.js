const multer = require('multer');
const path = require('path');

// Configure storage for different types of uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Determine the upload folder based on the upload type
    switch(req.params.type) {
      case 'bikes':
        uploadPath += 'bikes/';
        break;
      case 'documents':
        uploadPath += 'documents/';
        break;
      case 'ride-images':
        uploadPath += 'ride-images/';
        break;
      default:
        uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    // Use a unique filename: userID_timestamp_originalname
    const uniqueSuffix = `${req.user.id}_${Date.now()}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;