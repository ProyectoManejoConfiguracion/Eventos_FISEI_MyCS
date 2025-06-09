const express = require('express');
const router = express.Router();
const registro_eventoController = require('../controllers/registro_eventoController');

router.get('/', registro_eventoController.getAll);
router.get('/:id', registro_eventoController.getOne);
router.post('/', registro_eventoController.create);
router.put('/:id', registro_eventoController.update);
router.delete('/:id', registro_eventoController.delete);

module.exports = router;
