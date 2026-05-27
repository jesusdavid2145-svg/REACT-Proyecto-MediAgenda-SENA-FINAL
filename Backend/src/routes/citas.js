const router = require('express').Router();
const auth   = require('../middleware/authMiddleware');
const { obtenerCitas, agendarCita, cancelarCita } = require('../controllers/citasController');

router.get('/',               auth, obtenerCitas);
router.post('/',              auth, agendarCita);
router.put('/cancelar/:id',   auth, cancelarCita);

module.exports = router;