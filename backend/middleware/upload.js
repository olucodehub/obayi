const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage for Azure Blob uploads
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    const allowedImageTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(',');
    const allowedDocumentTypes = (process.env.ALLOWED_DOCUMENT_TYPES || 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png').split(',');
    
    const isUploadingProfilePicture = req.route && req.route.path.includes('profile-picture');
    const allowedTypes = isUploadingProfilePicture ? allowedImageTypes : [...allowedImageTypes, ...allowedDocumentTypes];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 1 // Allow only 1 file per request
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        switch (error.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({ 
                    error: 'File too large', 
                    message: `File size must be less than ${Math.round((parseInt(process.env.MAX_FILE_SIZE) || 5242880) / 1024 / 1024)}MB` 
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({ 
                    error: 'Too many files', 
                    message: 'Only one file is allowed per upload' 
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({ 
                    error: 'Unexpected field', 
                    message: 'Invalid file field name' 
                });
            default:
                return res.status(400).json({ 
                    error: 'Upload error', 
                    message: error.message 
                });
        }
    }
    
    if (error.message.includes('Invalid file type')) {
        return res.status(400).json({ 
            error: 'Invalid file type', 
            message: error.message 
        });
    }
    
    next(error);
};

module.exports = {
    upload,
    handleUploadError,
    single: (fieldName) => [upload.single(fieldName), handleUploadError]
};