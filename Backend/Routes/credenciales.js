const express = require('express');
const router = express.Router();
const credencialesController = require('../Controllers/credencialesController');

router.get('/', credencialesController.getAll);
router.get('/:id', credencialesController.getOne);
router.post('/', credencialesController.create);
router.put('/:id', credencialesController.update);
router.delete('/:id', credencialesController.delete);

module.exports = router;
