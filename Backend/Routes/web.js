const express = require('express');
const router = express.Router();
const webController = require('../Controllers/webController');

router.get('/', webController.getWebContent);
router.put('/:id', webController.updateContent);

module.exports = router;
