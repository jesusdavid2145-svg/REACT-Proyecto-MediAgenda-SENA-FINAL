const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  }

  try {
    const usuario = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};