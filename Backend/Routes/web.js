const express = require('express');
const router = express.Router();
const tarifas_eventoController = require('../Controllers/webController');


router.get('/', tarifas_eventoController.getWebContent);
router.put('/:id', tarifas_eventoController.updateContent);

module.exports = router;
