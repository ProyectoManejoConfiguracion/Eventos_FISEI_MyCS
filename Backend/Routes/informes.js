const express = require('express');
const router = express.Router();
const informesController = require('../controllers/informesController');

router.get('/', informesController.getAll);
router.get('/:id', informesController.getOne);
router.post('/', informesController.create);
router.put('/:id', informesController.update);
router.delete('/:id', informesController.delete);

module.exports = router;
