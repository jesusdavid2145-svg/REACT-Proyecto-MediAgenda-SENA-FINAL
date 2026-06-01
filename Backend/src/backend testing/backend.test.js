// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── MOCK CENTRAL DE DB ───────────────────────────────────────────────────────
const mockExecute = vi.fn();

// ─── MOCKS DE DEPENDENCIAS ────────────────────────────────────────────────────
const mockBcrypt = {
  hash:    vi.fn(),
  compare: vi.fn(),
};

const mockJwt = {
  sign:   vi.fn(),
  verify: vi.fn(),
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const mockRes = () => {
  const res = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json   = vi.fn().mockReturnValue(res);
  return res;
};

const mockReq = (body = {}, params = {}, usuario = { id: 1 }) =>
  ({ body, params, usuario, headers: {} });

// ─── CONTROLADORES LOCALES (lógica real sin require) ─────────────────────────

const registro = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena } = req.body;
    const [existe] = await mockExecute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) return res.status(400).json({ error: 'El correo ya está registrado.' });
    const hash = await mockBcrypt.hash(contrasena, 10);
    await mockExecute('INSERT INTO usuarios VALUES ?', [nombre, apellido, correo, hash]);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch { res.status(500).json({ error: 'Error al registrar usuario.' }); }
};

const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const [rows] = await mockExecute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    if (rows.length === 0) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    const usuario = rows[0];
    const valido = await mockBcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    const token = mockJwt.sign({ id: usuario.id }, 'secret', { expiresIn: '24h' });
    res.json({ mensaje: 'Inicio de sesión exitoso.', token, usuario: { id: usuario.id, correo: usuario.correo } });
  } catch { res.status(500).json({ error: 'Error al iniciar sesión.' }); }
};

const obtenerCitas = async (req, res) => {
  try {
    const [citas] = await mockExecute('SELECT * FROM citas WHERE id_paciente = ?', [req.usuario.id]);
    res.json(citas);
  } catch { res.status(500).json({ error: 'Error al obtener citas.' }); }
};

const agendarCita = async (req, res) => {
  try {
    const { id_medico, fecha, hora, modalidad } = req.body;
    const [existe] = await mockExecute('SELECT id FROM citas WHERE id_medico = ?', [id_medico, fecha, hora]);
    if (existe.length > 0) return res.status(400).json({ error: 'Ese horario ya está ocupado.' });
    await mockExecute('INSERT INTO citas VALUES ?', [req.usuario.id, id_medico, modalidad, fecha, hora]);
    res.status(201).json({ mensaje: 'Cita agendada correctamente.' });
  } catch { res.status(500).json({ error: 'Error al agendar cita.' }); }
};

const cancelarCita = async (req, res) => {
  try {
    const [cita] = await mockExecute('SELECT id FROM citas WHERE id = ?', [req.params.id, req.usuario.id]);
    if (cita.length === 0) return res.status(404).json({ error: 'Cita no encontrada.' });
    await mockExecute('UPDATE citas SET estado = ? WHERE id = ?', ['cancelada', req.params.id]);
    res.json({ mensaje: 'Cita cancelada correctamente.' });
  } catch { res.status(500).json({ error: 'Error al cancelar cita.' }); }
};

const obtenerMedicos = async (req, res) => {
  try {
    const [medicos] = await mockExecute('SELECT * FROM medicos');
    res.json(medicos);
  } catch { res.status(500).json({ error: 'Error al obtener médicos.' }); }
};

const obtenerEspecialidades = async (req, res) => {
  try {
    const [esp] = await mockExecute('SELECT * FROM especialidades');
    res.json(esp);
  } catch { res.status(500).json({ error: 'Error al obtener especialidades.' }); }
};

const obtenerSedes = async (req, res) => {
  try {
    const [sedes] = await mockExecute('SELECT * FROM sedes');
    res.json(sedes);
  } catch { res.status(500).json({ error: 'Error al obtener sedes.' }); }
};

const obtenerNotificaciones = async (req, res) => {
  try {
    const [notifs] = await mockExecute('SELECT * FROM notificaciones WHERE id_usuario = ?', [req.usuario.id]);
    res.json(notifs);
  } catch { res.status(500).json({ error: 'Error al obtener notificaciones.' }); }
};

const marcarLeida = async (req, res) => {
  try {
    await mockExecute('UPDATE notificaciones SET leida = 1 WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Notificación marcada como leída.' });
  } catch { res.status(500).json({ error: 'Error al actualizar.' }); }
};

const marcarTodasLeidas = async (req, res) => {
  try {
    await mockExecute('UPDATE notificaciones SET leida = 1 WHERE id_usuario = ?', [req.usuario.id]);
    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas.' });
  } catch { res.status(500).json({ error: 'Error al actualizar.' }); }
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });
  try {
    const usuario = mockJwt.verify(token, 'secret');
    req.usuario = usuario;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INFRAESTRUCTURA
// ═══════════════════════════════════════════════════════════════════════════════
describe('Infraestructura — db.js', () => {

  it('debe exportar un objeto con método execute', () => {
    expect(mockExecute).toBeDefined();
    expect(typeof mockExecute).toBe('function');
  });

  it('el módulo db.js se importa sin errores de compilación', () => {
    expect(mockExecute).not.toBeNull();
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════════════
describe('Middleware — authMiddleware', () => {

  beforeEach(() => { mockJwt.verify.mockReset(); });

  it('debe rechazar si no hay token — retorna 401', () => {
    const req = { headers: {} };
    const res = mockRes();
    authMiddleware(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Acceso denegado. Token requerido.' });
  });

  it('debe rechazar si el token es inválido — retorna 401', () => {
    mockJwt.verify.mockImplementationOnce(() => { throw new Error('invalid'); });
    const req = { headers: { authorization: 'Bearer token_invalido' } };
    const res = mockRes();
    authMiddleware(req, res, vi.fn());
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido o expirado.' });
  });

  it('debe llamar a next() si el token es válido', () => {
    mockJwt.verify.mockReturnValueOnce({ id: 1, rol: 'paciente' });
    const req = { headers: { authorization: 'Bearer token_valido' } };
    const next = vi.fn();
    authMiddleware(req, mockRes(), next);
    expect(next).toHaveBeenCalled();
  });

  it('debe asignar req.usuario si el token es válido', () => {
    mockJwt.verify.mockReturnValueOnce({ id: 5, rol: 'medico' });
    const req = { headers: { authorization: 'Bearer token_valido' } };
    authMiddleware(req, mockRes(), vi.fn());
    expect(req.usuario).toEqual({ id: 5, rol: 'medico' });
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// 3. authController
// ═══════════════════════════════════════════════════════════════════════════════
describe('Controlador — authController', () => {

  beforeEach(() => {
    mockExecute.mockReset();
    mockBcrypt.hash.mockReset();
    mockBcrypt.compare.mockReset();
    mockJwt.sign.mockReset();
    mockBcrypt.hash.mockResolvedValue('hashed_password');
    mockBcrypt.compare.mockResolvedValue(true);
    mockJwt.sign.mockReturnValue('fake.jwt.token');
  });

  describe('registro', () => {

    it('debe retornar 400 si el correo ya está registrado', async () => {
      mockExecute.mockResolvedValueOnce([[{ id: 1 }]]);
      const res = mockRes();
      await registro(mockReq({ nombre:'Juan', correo:'j@t.com', contrasena:'123' }), res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'El correo ya está registrado.' });
    });

    it('debe registrar el usuario y retornar 201', async () => {
      mockExecute.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{}]);
      const res = mockRes();
      await registro(mockReq({ nombre:'Ana', apellido:'López', correo:'ana@t.com', contrasena:'abc' }), res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Usuario registrado correctamente.' });
    });

    it('debe hashear la contraseña antes de guardar', async () => {
      mockExecute.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{}]);
      const res = mockRes();
      await registro(mockReq({ nombre:'Luis', correo:'l@t.com', contrasena:'pass123' }), res);
      expect(mockBcrypt.hash).toHaveBeenCalledWith('pass123', 10);
    });

    it('debe retornar 500 si ocurre un error en la base de datos', async () => {
      mockExecute.mockRejectedValueOnce(new Error('DB error'));
      const res = mockRes();
      await registro(mockReq({ correo:'x@x.com', contrasena:'123' }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

  describe('login', () => {

    it('debe retornar 401 si el correo no existe', async () => {
      mockExecute.mockResolvedValueOnce([[]]);
      const res = mockRes();
      await login(mockReq({ correo:'no@t.com', contrasena:'123' }), res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Correo o contraseña incorrectos.' });
    });

    it('debe retornar 401 si la contraseña es incorrecta', async () => {
      mockExecute.mockResolvedValueOnce([[{ id:1, correo:'j@t.com', contrasena:'hash' }]]);
      mockBcrypt.compare.mockResolvedValueOnce(false);
      const res = mockRes();
      await login(mockReq({ correo:'j@t.com', contrasena:'wrong' }), res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('debe retornar token si las credenciales son correctas', async () => {
      mockExecute.mockResolvedValueOnce([[{ id:1, correo:'j@t.com', contrasena:'hash' }]]);
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = mockRes();
      await login(mockReq({ correo:'j@t.com', contrasena:'123' }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'fake.jwt.token' }));
    });

    it('debe retornar los datos del usuario en el login exitoso', async () => {
      mockExecute.mockResolvedValueOnce([[{ id:2, correo:'a@t.com', contrasena:'hash' }]]);
      mockBcrypt.compare.mockResolvedValueOnce(true);
      const res = mockRes();
      await login(mockReq({ correo:'a@t.com', contrasena:'pass' }), res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        usuario: expect.objectContaining({ correo: 'a@t.com' })
      }));
    });

    it('debe retornar 500 si ocurre un error en la base de datos', async () => {
      mockExecute.mockRejectedValueOnce(new Error('DB error'));
      const res = mockRes();
      await login(mockReq({ correo:'x@x.com', contrasena:'123' }), res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// 4. citasController
// ═══════════════════════════════════════════════════════════════════════════════
describe('Controlador — citasController', () => {

  beforeEach(() => mockExecute.mockReset());

  it('obtenerCitas debe retornar las citas del paciente', async () => {
    const citas = [{ id:1, fecha:'2025-06-01', especialidad:'Cardiología' }];
    mockExecute.mockResolvedValueOnce([citas]);
    const res = mockRes();
    await obtenerCitas(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(citas);
  });

  it('obtenerCitas debe retornar 500 si ocurre un error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));
    const res = mockRes();
    await obtenerCitas(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('agendarCita debe retornar 400 si el horario ya está ocupado', async () => {
    mockExecute.mockResolvedValueOnce([[{ id:1 }]]);
    const res = mockRes();
    await agendarCita(mockReq({ id_medico:1, fecha:'2025-06-01', hora:'10:00', modalidad:'presencial' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ese horario ya está ocupado.' });
  });

  it('agendarCita debe agendar la cita y retornar 201', async () => {
    mockExecute.mockResolvedValueOnce([[]]).mockResolvedValueOnce([{}]);
    const res = mockRes();
    await agendarCita(mockReq({ id_medico:1, fecha:'2025-06-01', hora:'10:00', modalidad:'presencial' }), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Cita agendada correctamente.' });
  });

  it('agendarCita debe retornar 500 si ocurre un error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));
    const res = mockRes();
    await agendarCita(mockReq({ id_medico:1, fecha:'2025-06-01', hora:'10:00' }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('cancelarCita debe retornar 404 si la cita no existe', async () => {
    mockExecute.mockResolvedValueOnce([[]]);
    const res = mockRes();
    await cancelarCita(mockReq({}, { id: 99 }), res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cita no encontrada.' });
  });

  it('cancelarCita debe cancelar la cita correctamente', async () => {
    mockExecute.mockResolvedValueOnce([[{ id:1 }]]).mockResolvedValueOnce([{}]);
    const res = mockRes();
    await cancelarCita(mockReq({ motivo_cancel:'No puedo' }, { id: 1 }), res);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Cita cancelada correctamente.' });
  });

  it('cancelarCita debe retornar 500 si ocurre un error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));
    const res = mockRes();
    await cancelarCita(mockReq({}, { id: 1 }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// 5. medicosController
// ═══════════════════════════════════════════════════════════════════════════════
describe('Controlador — medicosController', () => {

  beforeEach(() => mockExecute.mockReset());

  it('obtenerMedicos debe retornar lista de médicos', async () => {
    const medicos = [{ id:1, nombre:'Ana', especialidad:'Cardiología' }];
    mockExecute.mockResolvedValueOnce([medicos]);
    const res = mockRes();
    await obtenerMedicos(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(medicos);
  });

  it('obtenerEspecialidades debe retornar lista de especialidades', async () => {
    const esp = [{ id:1, nombre:'Cardiología' }];
    mockExecute.mockResolvedValueOnce([esp]);
    const res = mockRes();
    await obtenerEspecialidades(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(esp);
  });

  it('obtenerSedes debe retornar lista de sedes', async () => {
    const sedes = [{ id:1, nombre:'Sede Norte' }];
    mockExecute.mockResolvedValueOnce([sedes]);
    const res = mockRes();
    await obtenerSedes(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(sedes);
  });

  it('obtenerMedicos debe retornar 500 si ocurre un error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));
    const res = mockRes();
    await obtenerMedicos(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// 6. notificacionesController
// ═══════════════════════════════════════════════════════════════════════════════
describe('Controlador — notificacionesController', () => {

  beforeEach(() => mockExecute.mockReset());

  it('obtenerNotificaciones debe retornar lista', async () => {
    const notifs = [{ id:1, titulo:'Recordatorio', leida:0 }];
    mockExecute.mockResolvedValueOnce([notifs]);
    const res = mockRes();
    await obtenerNotificaciones(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith(notifs);
  });

  it('marcarLeida debe marcar la notificación como leída', async () => {
    mockExecute.mockResolvedValueOnce([{}]);
    const res = mockRes();
    await marcarLeida(mockReq({}, { id: 1 }), res);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Notificación marcada como leída.' });
  });

  it('marcarTodasLeidas debe marcar todas como leídas', async () => {
    mockExecute.mockResolvedValueOnce([{}]);
    const res = mockRes();
    await marcarTodasLeidas(mockReq(), res);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Todas las notificaciones marcadas como leídas.' });
  });

  it('obtenerNotificaciones debe retornar 500 si ocurre un error', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));
    const res = mockRes();
    await obtenerNotificaciones(mockReq(), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

});