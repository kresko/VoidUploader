const upload = require("../upload");
const db = require("../db/queryHandler");
const { mkdir, rm } = require('fs');

async function renderHomepage(req, res) {
    const userId = req.user ? req.user.id : 0;
    const folders = await db.getAllFoldersByUserId(userId);
    const error = req.query.error;

    res.render('index', { user: req.user, folders: folders, error: error });
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
    try {
        await db.insertNewFolder(req.body.folderName, req.user.id);

        mkdir(`./uploads/${req.body.folderName}`, { recursive: true }, (err) => {
            if (err) throw err;
        });
        //add folder to filesystem fs.mkdir fs.rmdir
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

module.exports = {
    renderHomepage,
    renderUploadForm,
    uploadFile,
    createNewFolder,
    deleteFolder
};