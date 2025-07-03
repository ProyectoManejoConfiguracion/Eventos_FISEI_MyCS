const express = require('express');
const router = express.Router();
const eventosController = require('../Controllers/eventosController');

router.get('/', eventosController.getAll);
router.get('/tarifas', eventosController.getEventosPagoConTarifas);
router.get('/:id', eventosController.getOne);
router.post('/asignar_tarifa', eventosController.asignarOActualizarTarifa);
router.post('/', eventosController.create);
router.put('/:id', eventosController.editarEventoCompleto);
router.delete('/:id', eventosController.delete);
router.put('/visibilidad/:id', eventosController.cambiarVisibilidad);
module.exports = router;
