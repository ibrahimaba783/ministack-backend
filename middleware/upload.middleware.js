const multer = require('multer');
const path = require('path');

// configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // dossier ou stocker les photos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // nom unique
    }
});

const upload = multer({ storage });

module.exports = upload;