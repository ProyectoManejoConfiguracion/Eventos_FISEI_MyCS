const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.get('/', pagosController.getAll);
router.get('/:id', pagosController.getOne);
router.post('/', pagosController.create);
router.put('/:id', pagosController.update);
router.delete('/:id', pagosController.delete);

module.exports = router;
