const upload = require("../upload");
const db = require("../db/queryHandler");

async function renderHomepage(req, res) {
    const userId = req.user ? req.user.id : 0;
    const folders = await db.getAllFoldersByUserId(userId);

    res.render('index', { user: req.user, folders: folders });
}

async function renderUploadForm(req, res) {
    res.render('upload', { user: req.user });
}

const uploadFile = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send('File upload failed');
        }
        return res.redirect('/');
    });
};

async function  createNewFolder(req, res) {
    await db.insertNewFolder(req.body.folderName, req.user.id);

    res.redirect('/');
}

async function deleteFolder(req, res) {
    await db.deleteFolder(req.params.id);

    res.redirect('/');
}

module.exports = {
    renderHomepage,
    renderUploadForm,
    uploadFile,
    createNewFolder,
    deleteFolder
};