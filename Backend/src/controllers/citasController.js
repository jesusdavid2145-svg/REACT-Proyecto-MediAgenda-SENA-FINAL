const db = require('../config/db');

const obtenerCitas = async (req, res) => {
  try {
    const id_paciente = req.usuario.id;

    const [citas] = await db.execute(
      `SELECT c.id, c.fecha, c.hora, c.modalidad, c.estado, c.motivo, c.link_virtual,
              m.nombre AS medico_nombre, m.apellido AS medico_apellido,
              e.nombre AS especialidad,
              s.nombre AS sede
       FROM citas c
       JOIN medicos m ON c.id_medico = m.id
       JOIN especialidades e ON m.id_especialidad = e.id
       LEFT JOIN sedes s ON c.id_sede = s.id
       WHERE c.id_paciente = ?
       ORDER BY c.fecha DESC, c.hora DESC`,
      [id_paciente]
    );

    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas.', detalle: error.message });
  }
};

const agendarCita = async (req, res) => {
  try {
    const id_paciente = req.usuario.id;
    const { id_medico, id_sede, modalidad, fecha, hora, motivo } = req.body;

    const [existe] = await db.execute(
      `SELECT id FROM citas 
       WHERE id_medico = ? AND fecha = ? AND hora = ? 
       AND estado NOT IN ('cancelada')`,
      [id_medico, fecha, hora]
    );

    if (existe.length > 0) {
      return res.status(400).json({ error: 'Ese horario ya está ocupado.' });
    }

    await db.execute(
      `INSERT INTO citas (id_paciente, id_medico, id_sede, modalidad, fecha, hora, motivo)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id_paciente, id_medico, id_sede || null, modalidad, fecha, hora, motivo || null]
    );

    res.status(201).json({ mensaje: 'Cita agendada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agendar cita.', detalle: error.message });
  }
};

const cancelarCita = async (req, res) => {
  try {
    const id_paciente = req.usuario.id;
    const { id } = req.params;
    const { motivo_cancel } = req.body;

    const [cita] = await db.execute(
      'SELECT id FROM citas WHERE id = ? AND id_paciente = ?',
      [id, id_paciente]
    );

    if (cita.length === 0) {
      return res.status(404).json({ error: 'Cita no encontrada.' });
    }

    await db.execute(
      `UPDATE citas SET estado = 'cancelada', motivo_cancel = ?, cancelada_por = 'paciente'
       WHERE id = ?`,
      [motivo_cancel || null, id]
    );

    res.json({ mensaje: 'Cita cancelada correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar cita.', detalle: error.message });
  }
};

module.exports = { obtenerCitas, agendarCita, cancelarCita };