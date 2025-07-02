const express = require('express');
const router = express.Router();
const autoridadesController = require('../Controllers/autoridadesController');

router.get('/', autoridadesController.getAll);
router.get('/cedula/:cedula', autoridadesController.getByCedula);
router.put('/upload/:CED_PER', autoridadesController.updatePhoto);
router.get('/:id', autoridadesController.getOne);
router.post('/', autoridadesController.create);
router.put('/:id', autoridadesController.update);
router.delete('/:id', autoridadesController.delete);

module.exports = router;