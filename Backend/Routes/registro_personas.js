const express = require('express');
const router = express.Router();
const registro_personasController = require('../Controllers/registro_personasController');

router.get('/', registro_personasController.getAll);
router.get('/:id', registro_personasController.getOne);
router.post('/', registro_personasController.create);
router.put('/:id', registro_personasController.update);
router.delete('/:id', registro_personasController.delete);
router.post('/register/', registro_personasController.inscribirPersona);

module.exports = router;
