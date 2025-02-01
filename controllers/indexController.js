const { upload, uploadMiddleware, downloadMiddleware, deleteMiddleware, deleteFolderMiddleware } = require("../upload");
const db = require("../db/queryHandler");

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
        await uploadMiddleware(req, res, folder);
        await db.insertNewFile(req.file, folder);
        res.redirect('/');
    } catch (e) {
        console.error(e);
        res.status(500).send(error.message);
    }
};

async function  createNewFolder(req, res) {
    try {
        await db.insertNewFolder(req.body.folderName, req.user.id);
    } catch(e) {
        if (e.code === 'P2002') {
            return res.redirect('/?error=duplicated-folder');
        }
    }

    res.redirect('/');
}

async function deleteFolder(req, res) {
    const folder = await db.getFolderNameById(req.params.id);
    await deleteFolderMiddleware(folder.name);
    await db.deleteFolder(req.params.id);

    res.redirect('/');
}

async function downloadFile(req, res) {
    try {
        const file = await db.getFileById(req.params.id);
        const fileToDownload = await downloadMiddleware(file.path);

        res.setHeader('content-type', fileToDownload.type);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`)
        res.send(fileToDownload);
    } catch (e) {
        console.error(error);
        res.status(500).send('An unexpected error occurred');
    }
}

async function deleteFile(req, res) {
    const file = await db.getFileById(req.params.id);
    await deleteMiddleware(file.path);
    await db.deleteFile(req.params.id);

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