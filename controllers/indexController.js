const upload = require("../upload");

async function renderHomepage(req, res) {
    res.render('index', { user: req.user });
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

module.exports = {
    renderHomepage,
    renderUploadForm,
    uploadFile
};