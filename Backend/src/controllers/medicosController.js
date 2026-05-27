const db = require('../config/db');

const obtenerMedicos = async (req, res) => {
  try {
    const [medicos] = await db.execute(
      `SELECT m.id, m.nombre, m.apellido, m.correo, m.telefono,
              m.descripcion, m.foto_url, m.calificacion,
              e.nombre AS especialidad
       FROM medicos m
       JOIN especialidades e ON m.id_especialidad = e.id
       WHERE m.activo = 1
       ORDER BY e.nombre, m.apellido`
    );
    res.json(medicos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener médicos.', detalle: error.message });
  }
};

const obtenerEspecialidades = async (req, res) => {
  try {
    const [especialidades] = await db.execute(
      'SELECT id, nombre, descripcion FROM especialidades WHERE activo = 1'
    );
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener especialidades.', detalle: error.message });
  }
};

const obtenerDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const [disponibilidad] = await db.execute(
      `SELECT d.dia_semana, d.hora_inicio, d.hora_fin, d.duracion_min, d.modalidad,
              s.nombre AS sede, s.direccion
       FROM disponibilidad d
       LEFT JOIN sedes s ON d.id_sede = s.id
       WHERE d.id_medico = ? AND d.activo = 1`,
      [id]
    );
    res.json(disponibilidad);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener disponibilidad.', detalle: error.message });
  }
};

const obtenerSedes = async (req, res) => {
  try {
    const [sedes] = await db.execute(
      'SELECT id, nombre, direccion, ciudad, telefono FROM sedes WHERE activo = 1'
    );
    res.json(sedes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sedes.', detalle: error.message });
  }
};

module.exports = { obtenerMedicos, obtenerEspecialidades, obtenerDisponibilidad, obtenerSedes };