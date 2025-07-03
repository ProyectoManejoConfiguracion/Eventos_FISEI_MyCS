const express = require('express');
const router = express.Router();
const homeController = require('../Controllers/homeController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', homeController.getAll);
router.get('/:id', homeController.getOne);
router.post('/', upload.single('imagen'), homeController.create);
router.put('/:id', upload.single('imagen'), homeController.update);
router.delete('/:id', homeController.delete);

module.exports = router;