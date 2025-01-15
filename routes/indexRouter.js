const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.renderHomepage);
indexRouter.get('/upload-form', indexController.renderUploadForm);
indexRouter.post('/upload', indexController.uploadFile);
indexRouter.post('/create-new-folder', indexController.createNewFolder);
indexRouter.get('/delete-folder/:id', indexController.deleteFolder);

module.exports = indexRouter;