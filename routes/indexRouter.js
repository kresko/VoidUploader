const { Router } = require('express');
const indexRouter = Router();
const indexController = require('../controllers/indexController');

indexRouter.get('/', indexController.renderHomepage);
indexRouter.get('/upload-form', indexController.renderUploadForm);
indexRouter.post('/upload', indexController.uploadFile);

module.exports = indexRouter;