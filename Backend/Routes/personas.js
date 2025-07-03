const express = require('express');
const router = express.Router();
const personasController = require('../Controllers/personasController');

router.get('/', personasController.getAll);
router.get('/personas/no-verificadas', personasController.getPersonasNoVerificadas);
router.get('/:id', personasController.getOne);
router.post('/login', personasController.login);
router.post('/', personasController.create);
router.put('/:id', personasController.update);
router.delete('/:id', personasController.delete);


router.put('/estado/:id', personasController.cambiarEstadoPersona);

router.get('/autoridades/no-verificadas', personasController.getAutoridadesNoVerificadas);
router.put('/autoridades/estado/:id', personasController.cambiarEstadoAutoridad);

router.get('/estudiantes/no-verificados', personasController.getEstudiantesNoVerificados);
router.put('/estudiantes/estado/:id', personasController.cambiarEstadoEstudiante);

module.exports = router;
