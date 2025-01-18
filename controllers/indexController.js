const { upload, uploadMiddleware } = require("../upload");
const db = require("../db/queryHandler");
const { mkdir, rm } = require('fs');

async function renderHomepage(req, res) {
    const userId = req.user ? req.user.id : 0;
    const folders = await db.getAllFoldersByUserId(userId);
    const files = await db.getAllFiles();
    const error = req.query.error;

    res.render('index', { user: req.user, folders: folders, files: files, error: error });
}

async function renderUploadForm(req, res) {
    res.render('upload', { user: req.user });
}

const uploadFile = async (req, res) => {
    try {
        const folder = await db.getFolderByName(req.params.id);
        await uploadMiddleware(req, res);
        await db.insertNewFile(req.file, folder.id);
        res.redirect('/');
    } catch (e) {
        console.error(e);
        res.status(500).send(error.message);
    }
};

async function  createNewFolder(req, res) {
    try {
        await db.insertNewFolder(req.body.folderName, req.user.id);

        mkdir(`./uploads/${req.body.folderName}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
    } catch(e) {
        if (e.code === 'P2002') {
            return res.redirect('/?error=duplicated-folder');
        }
    }

    res.redirect('/');
}

async function deleteFolder(req, res) {
    const folder = await db.getFolderNameById(req.params.id);
    await db.deleteFolder(req.params.id);

    rm(`./uploads/${folder.name}`, { recursive: true }, (err) => {
        if (err) throw err;
    });

    res.redirect('/');
}

//TODO: finish functionality
async function downloadFile(req, res) {

}

async function deleteFile(req, res) {
    const file = await db.getFileById(req.params.id);
    const folder = await db.getFolderNameById(file.folderId);
    await db.deleteFile(req.params.id);

    rm(`./uploads/${folder.name}/${file.name}`, { recursive: true }, (err) => {
        if (err) throw err;
    });

    res.redirect('/');
}

module.exports = {
    renderHomepage,
    renderUploadForm,
    uploadFile,
    createNewFolder,
    deleteFolder,
    downloadFile,
    deleteFile
};