const express = require('express');
const router = express.Router();
const homeController = require('../Controllers/homeController');

router.get('/', homeController.getAll);
router.get('/:id', homeController.getOne);
router.post('/', homeController.create);
router.put('/:id', homeController.update);
router.delete('/:id', homeController.delete);

module.exports = router;