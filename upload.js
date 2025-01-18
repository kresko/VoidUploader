const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `uploads/${req.params.id}/`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadMiddleware = (req, res) => {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.log(err);
                reject(new Error('File upload failed'));
            } else {
                resolve();
            }
        });
    });
};

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = {
    upload,
    uploadMiddleware
};