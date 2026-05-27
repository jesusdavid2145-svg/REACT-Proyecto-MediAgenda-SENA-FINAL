const db = require('../config/db');

const obtenerNotificaciones = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    const [notificaciones] = await db.execute(
      `SELECT id, titulo, mensaje, tipo, leida, creado_en
       FROM notificaciones
       WHERE id_usuario = ?
       ORDER BY creado_en DESC
       LIMIT 10`,
      [id_usuario]
    );
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones.', detalle: error.message });
  }
};

const marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const id_usuario = req.usuario.id;
    await db.execute(
      'UPDATE notificaciones SET leida = 1 WHERE id = ? AND id_usuario = ?',
      [id, id_usuario]
    );
    res.json({ mensaje: 'Notificación marcada como leída.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar notificación.', detalle: error.message });
  }
};

const marcarTodasLeidas = async (req, res) => {
  try {
    const id_usuario = req.usuario.id;
    await db.execute(
      'UPDATE notificaciones SET leida = 1 WHERE id_usuario = ?',
      [id_usuario]
    );
    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar notificaciones.', detalle: error.message });
  }
};

module.exports = { obtenerNotificaciones, marcarLeida, marcarTodasLeidas };