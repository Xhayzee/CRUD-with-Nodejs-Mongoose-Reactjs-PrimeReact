const multer = require('multer');

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
exports.upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, });