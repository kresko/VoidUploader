const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
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

                const { data, error } = await supabase.storage
                    .from('void-uploader')
                    .upload(filePath, buffer, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: req.file.mimetype,
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
        const correctedFilePath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

        const { data, error } = await supabase.storage
            .from('void-uploader')
            .remove([correctedFilePath]);

        if (error) {
            console.error('Error deleting file:', error.message);
            throw new Error('Failed to delete file');
        }

        console.log('File deleted successfully:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error while deleting file:', err);
        throw err;
    }
};

const deleteFolderMiddleware = async (folderPath) => {
    try {
        console.log(`Deleting folder: ${folderPath}`);

        const correctedFolderPath = folderPath.startsWith('/') ? folderPath.slice(1) : folderPath;

        const { data: files, error: listError } = await supabase.storage
            .from('void-uploader')
            .list(correctedFolderPath);

        if (listError) {
            console.error('Error listing folder contents:', listError.message);
            throw new Error('Failed to list folder contents');
        }

        if (!files.length) {
            console.log('Folder is already empty.');
            return;
        }

        const filePaths = files.map(file => `${correctedFolderPath}/${file.name}`);

        const { error: deleteError } = await supabase.storage
            .from('void-uploader')
            .remove(filePaths);

        if (deleteError) {
            console.error('Error deleting files:', deleteError.message);
            throw new Error('Failed to delete files in the folder');
        }

        console.log(`Folder '${folderPath}' deleted successfully.`);
    } catch (err) {
        console.error('Unexpected error while deleting folder:', err);
        throw err;
    }
};

const downloadMiddleware = async (filePath) => {
    try {
        const { data, error } = await supabase.storage
            .from('void-uploader')
            .download(filePath);

        if (error) {
            console.error('Error downloading file:', error.message);
            throw new Error('Failed to download file');
        }

        console.log('File downloaded successfully:', data);
        return data;
    } catch (err) {
        console.error('Unexpected error while downloading file:', err);
        throw err;
    }
};

module.exports = {
    upload,
    uploadMiddleware,
    deleteMiddleware,
    deleteFolderMiddleware,
    downloadMiddleware
};