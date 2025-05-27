const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');

router.get('/', eventosController.getAll);
router.get('/:id', eventosController.getOne);
router.post('/', eventosController.create);
router.put('/:id', eventosController.update);
router.delete('/:id', eventosController.delete);

module.exports = router;
