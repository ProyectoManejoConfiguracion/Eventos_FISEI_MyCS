const express = require('express');
const router = express.Router();
const carrerasController = require('../Controllers/carrerasController');

router.get('/', carrerasController.getAll);
router.get('/:id', carrerasController.getOne);
router.post('/', carrerasController.create);
router.put('/:id', carrerasController.update);
router.delete('/:id', carrerasController.delete);

module.exports = router;
