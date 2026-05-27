const router = require('express').Router();
const { obtenerMedicos, obtenerEspecialidades, obtenerDisponibilidad, obtenerSedes } = require('../controllers/medicosController');

router.get('/',                   obtenerMedicos);
router.get('/especialidades',     obtenerEspecialidades);
router.get('/sedes',              obtenerSedes);
router.get('/:id/disponibilidad', obtenerDisponibilidad);

module.exports = router;