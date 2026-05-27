const db      = require('../config/db');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
require('dotenv').config();

const registro = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, telefono, fecha_nac, genero, tipo_documento, num_documento } = req.body;

    const [existe] = await db.execute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado.' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    await db.execute(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, fecha_nac, genero, tipo_documento, num_documento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, correo, hash, telefono || null, fecha_nac || null, genero || null, tipo_documento || null, num_documento || null]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario.', detalle: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const [rows] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const usuario = rows[0];

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id:       usuario.id,
        nombre:   usuario.nombre,
        apellido: usuario.apellido,
        correo:   usuario.correo,
        rol:      usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión.', detalle: error.message });
  }
};

module.exports = { registro, login };