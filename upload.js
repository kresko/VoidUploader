const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadMiddleware = (req, res, folder) => {
    return new Promise((resolve, reject) => {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                console.log('Multer error:', err);
                return reject(new Error('File upload failed'));
            }

            try {
                const { buffer, originalname } = req.file;

                const folderPath = folder.name || 'default';
                const filePath = `${folderPath}/${originalname}`;

                console.log('Uploading file:', originalname);

                // Upload file to Supabase Storage
                const { data, error } = await supabase.storage
                    .from('void-uploader') // Replace 'void-uploader' with your bucket name
                    .upload(filePath, buffer, { // tu dodaj ime foldera
                        cacheControl: '3600', // Cache control headers
                        upsert: false, // Prevent overwriting files
                        contentType: req.file.mimetype, // Set content type
                    });

                if (error) {
                    console.error('Error uploading file to Supabase:', error.message);
                    return reject(new Error('Failed to upload file to Supabase'));
                }

                console.log('File uploaded successfully:', data);
                resolve(data);
            } catch (uploadError) {
                console.error('Unexpected error during upload:', uploadError);
                reject(new Error('Unexpected error during upload'));
            }
        });
    });
};

const deleteMiddleware = async (filePath) => {
    try {
        const { data, error } = await supabase.storage
            .from('void-uploader') // Replace 'void-uploader' with your bucket name
            .remove([filePath]); // File path to delete (as an array)

        if (error) {
            console.error('Error deleting file:', error.message);
            throw new Error('Failed to delete file');
        }

        console.log('File deleted successfully:', data);
        return data; // Returns an array of deleted file paths
    } catch (err) {
        console.error('Unexpected error while deleting file:', err);
        throw err;
    }
};

const downloadMiddleware = async (filePath) => {
    try {
        const { data, error } = await supabase.storage
            .from('void-uploader') // Replace 'void-uploader' with your bucket name
            .download(filePath); // File path to download

        if (error) {
            console.error('Error downloading file:', error.message);
            throw new Error('Failed to download file');
        }

        console.log('File downloaded successfully:', data);
        return data; // `data` is a Blob (binary data)
    } catch (err) {
        console.error('Unexpected error while downloading file:', err);
        throw err;
    }
};

module.exports = {
    upload,
    uploadMiddleware,
    deleteMiddleware,
    downloadMiddleware
};