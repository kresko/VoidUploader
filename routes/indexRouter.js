const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.renderHomepage);
indexRouter.post('/upload/:id', indexController.uploadFile);
indexRouter.post('/create-new-folder', indexController.createNewFolder);
indexRouter.get('/delete-folder/:id', indexController.deleteFolder);
indexRouter.get('/download-file/:id', indexController.downloadFile);
indexRouter.get('/delete-file/:id', indexController.deleteFile);

module.exports = indexRouter;