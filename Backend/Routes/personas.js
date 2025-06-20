const express = require('express');
const router = express.Router();
const personasController = require('../Controllers/personasController');

router.get('/', personasController.getAll);
router.get('/:id', personasController.getOne);
router.post('/login', personasController.login);
router.post('/', personasController.create);
router.put('/:id', personasController.update);
router.delete('/:id', personasController.delete);

module.exports = router;
