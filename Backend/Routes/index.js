const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.getAll);
router.get('/:id', indexController.getOne);
router.post('/', indexController.create);
router.put('/:id', indexController.update);
router.delete('/:id', indexController.delete);

module.exports = router;
