const express = require('express');
const router = express.Router();
const tarifas_eventoController = require('../Controllers/tarifas_eventoController');

router.get('/', tarifas_eventoController.getAll);
router.get('/:id', tarifas_eventoController.getOne);
router.get('/evento/:id_evt', tarifas_eventoController.getAllByIdEvt);
router.post('/', tarifas_eventoController.create);
router.put('/:id', tarifas_eventoController.update);
router.delete('/:id', tarifas_eventoController.delete);

module.exports = router;
