const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',           require('./routes/auth'));
app.use('/api/citas',          require('./routes/citas'));
app.use('/api/medicos',        require('./routes/medicos'));
app.use('/api/notificaciones', require('./routes/notificaciones'));

app.get('/', (req, res) => {
  res.json({ mensaje: 'MediAgenda API funcionando correctamente' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de MediAgenda ejecutándose en http://localhost:${PORT}`);
});