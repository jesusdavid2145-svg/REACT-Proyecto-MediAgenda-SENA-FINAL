const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { obtenerNotificaciones, marcarLeida, marcarTodasLeidas } = require('../controllers/notificacionesController');

router.get('/',           auth, obtenerNotificaciones);
router.put('/:id/leer',   auth, marcarLeida);
router.put('/leer-todas', auth, marcarTodasLeidas);

module.exports = router;