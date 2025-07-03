const express = require('express');
const router = express.Router();
const carreraConfController = require('../Controllers/carrera-conf');

router.get('/:cedula', carreraConfController.getCarreraConf);

module.exports = router;

