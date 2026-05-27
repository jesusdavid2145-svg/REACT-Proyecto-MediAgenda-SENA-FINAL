import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const HORARIOS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

const styles = `
.ac-page-header { margin-bottom:1rem; }
.ac-page-header h1 { font-size:1.5rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.ac-page-header p  { font-size:0.875rem; color:#6b7280; }

.ac-alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.ac-alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.ac-alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.ac-alerta-texto span { font-size:0.82rem; font-weight:400; }
.ac-alerta-warning { background:#fff7ed; border:1px solid #fed7aa; }
.ac-alerta-warning .ac-alerta-icono { background:#fb923c; }
.ac-alerta-warning .ac-alerta-texto strong { color:#c2410c; }
.ac-alerta-warning .ac-alerta-texto span { color:#9a3412; }
.ac-alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.ac-alerta-success .ac-alerta-icono { background:#16a34a; }
.ac-alerta-success .ac-alerta-texto strong { color:#15803d; }
.ac-alerta-success .ac-alerta-texto span { color:#166534; }

.ac-grid { display:grid; grid-template-columns:1fr 280px; gap:1.5rem; align-items:start; }
.ac-form-section { background:#fff; border-radius:16px; padding:1.5rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.ac-form-row { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1rem; }
.ac-field { display:flex; flex-direction:column; gap:6px; }
.ac-field label { font-size:0.82rem; font-weight:600; color:#374151; }
.ac-opcional { font-weight:400; color:#9ca3af; }
.ac-input-wrap { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; background:#fafbff; transition:border-color 0.15s,box-shadow 0.15s; }
.ac-input-wrap:focus-within { border-color:#1a56db; box-shadow:0 0 0 3px rgba(26,86,219,0.1); background:#fff; }
.ac-input-wrap.error { border-color:#ef4444; background:#fff5f5; }
.ac-input-wrap svg { width:16px; height:16px; color:#9ca3af; flex-shrink:0; }
.ac-input-wrap select { flex:1; border:none; background:transparent; padding:10px 8px; font-size:0.875rem; color:#1e293b; outline:none; font-family:inherit; cursor:pointer; appearance:none; width:100%; }
.ac-textarea-wrap { position:relative; border:1.5px solid #e2e8f0; border-radius:10px; background:#fafbff; transition:border-color 0.15s; }
.ac-textarea-wrap:focus-within { border-color:#1a56db; box-shadow:0 0 0 3px rgba(26,86,219,0.1); background:#fff; }
.ac-textarea-wrap textarea { width:100%; border:none; background:transparent; padding:10px 12px; font-size:0.875rem; color:#1e293b; outline:none; font-family:inherit; resize:none; height:80px; line-height:1.5; }
.ac-textarea-wrap textarea::placeholder { color:#c4c9d4; }
.ac-char-count { position:absolute; bottom:8px; right:12px; font-size:0.72rem; color:#9ca3af; }

.ac-cal-horarios { display:grid; grid-template-columns:auto 1fr; gap:1.5rem; margin:1rem 0 1.25rem; }
.ac-calendario { background:#fff; border:1px solid #e2e8f4; border-radius:12px; padding:1rem; min-width:240px; }
.ac-cal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; }
.ac-cal-header span { font-size:0.9rem; font-weight:700; color:#0f172a; }
.ac-cal-header button { background:none; border:none; font-size:1.2rem; color:#6b7280; cursor:pointer; width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; transition:background 0.15s; }
.ac-cal-header button:hover { background:#f0f5ff; color:#1a56db; }
.ac-cal-nombres { display:grid; grid-template-columns:repeat(7,1fr); text-align:center; margin-bottom:0.5rem; }
.ac-cal-nombres span { font-size:0.72rem; font-weight:600; color:#9ca3af; padding:4px 0; }
.ac-cal-dias { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; }
.ac-cal-dia { aspect-ratio:1; display:flex; align-items:center; justify-content:center; font-size:0.8rem; border-radius:50%; cursor:pointer; color:#374151; transition:background 0.15s,color 0.15s; }
.ac-cal-dia:hover { background:#eff6ff; color:#1a56db; }
.ac-cal-dia.vacio { cursor:default; }
.ac-cal-dia.vacio:hover { background:none; }
.ac-cal-dia.no-disponible { color:#d1d5db; cursor:not-allowed; }
.ac-cal-dia.no-disponible:hover { background:none; color:#d1d5db; }
.ac-cal-dia.seleccionado { background:#1a56db; color:#fff; font-weight:700; }

.ac-horarios-wrap { padding-top:0.25rem; }
.ac-horarios-titulo { display:flex; align-items:center; gap:6px; font-size:0.875rem; font-weight:600; color:#0f172a; margin-bottom:0.75rem; }
.ac-horarios-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.ac-horario-btn { padding:8px 4px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:0.8rem; font-weight:500; color:#374151; background:#fff; cursor:pointer; transition:all 0.15s; font-family:inherit; text-align:center; }
.ac-horario-btn:hover { border-color:#1a56db; color:#1a56db; background:#eff6ff; }
.ac-horario-btn.active { background:#1a56db; border-color:#1a56db; color:#fff; font-weight:600; }

.ac-form-btns { display:flex; gap:1rem; justify-content:flex-end; margin-top:1rem; }
.ac-btn-cancelar { padding:10px 24px; background:transparent; color:#6b7280; font-size:0.9rem; font-weight:600; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.ac-btn-cancelar:hover { background:#f8fafc; }
.ac-btn-agendar { display:flex; align-items:center; gap:8px; padding:10px 24px; background:#1a56db; color:#fff; font-size:0.9rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.ac-btn-agendar:hover { background:#1648c0; }

.ac-resumen { background:#fff; border-radius:16px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); position:sticky; top:80px; }
.ac-resumen h3 { font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:1rem; }
.ac-resumen-items { display:flex; flex-direction:column; gap:0.85rem; }
.ac-resumen-item { display:flex; align-items:flex-start; gap:10px; }
.ac-resumen-item svg { flex-shrink:0; margin-top:2px; }
.ac-resumen-label { font-size:0.72rem; color:#9ca3af; display:block; margin-bottom:1px; }
.ac-resumen-valor { font-size:0.85rem; font-weight:600; color:#1e293b; }
`;

export default function AgendarCita() {
  const navigate      = useNavigate();
  const { token }     = useAuth();

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos,        setMedicos]        = useState([]);
  const [sedes,          setSedes]          = useState([]);

  const [especialidad,   setEspecialidad]   = useState("");
  const [medico,         setMedico]         = useState("");
  const [modalidad,      setModalidad]      = useState("");
  const [sede,           setSede]           = useState("");
  const [motivo,         setMotivo]         = useState("");

  const [fechaActual,    setFechaActual]    = useState(new Date());
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horario,        setHorario]        = useState(null);
  const [errores,        setErrores]        = useState({});
  const [alerta,         setAlerta]         = useState(null);

  // Inyectar estilos
  useEffect(() => {
    if (document.getElementById("ac-styles")) return;
    const tag = document.createElement("style");
    tag.id = "ac-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  // Cargar datos del backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resEsp, resMed, resSed] = await Promise.all([
          fetch(`${API}/medicos/especialidades`),
          fetch(`${API}/medicos`),
          fetch(`${API}/medicos/sedes`),
        ]);
        if (resEsp.ok) setEspecialidades(await resEsp.json());
        if (resMed.ok) setMedicos(await resMed.json());
        if (resSed.ok) setSedes(await resSed.json());
      } catch (err) { console.error(err); }
    };
    cargar();
  }, [token]);

  // ── Calendario ──
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const primerDia  = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1).getDay();
  const diasEnMes  = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0).getDate();
  const offset     = primerDia === 0 ? 6 : primerDia - 1;

  const generarDias = () => {
    const dias = [];
    for (let i = 0; i < offset; i++) dias.push({ vacio: true });
    for (let d = 1; d <= diasEnMes; d++) {
      const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), d);
      const str   = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      dias.push({ d, str, pasado: fecha < hoy });
    }
    return dias;
  };

  // ── Agendar ──
  const agendarCita = async () => {
    const nuevosErrores = {};
    if (!medico)          nuevosErrores.medico    = true;
    if (!modalidad)       nuevosErrores.modalidad = true;
    if (!diaSeleccionado) nuevosErrores.fecha     = true;
    if (!horario)         nuevosErrores.horario   = true;

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setAlerta({ tipo: "warning", titulo: "Campos incompletos", mensaje: "Debes seleccionar médico, fecha, hora y modalidad." });
      return;
    }

    try {
      const res  = await fetch(`${API}/citas`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({
          id_medico:  parseInt(medico),
          id_sede:    sede ? parseInt(sede) : null,
          modalidad,
          fecha:      diaSeleccionado,
          hora:       horario,
          motivo,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setAlerta({ tipo: "warning", titulo: "Error", mensaje: data.error || "No se pudo agendar la cita." }); return; }
      setAlerta({ tipo: "success", titulo: "¡Cita agendada!", mensaje: "Tu cita fue registrada correctamente." });
      setTimeout(() => navigate("/mis-citas"), 1500);
    } catch {
      setAlerta({ tipo: "warning", titulo: "Error de conexión", mensaje: "No se pudo conectar con el servidor." });
    }
  };

  const medicoSeleccionado = medicos.find(m => String(m.id) === medico);
  const especialidadLabel  = especialidades.find(e => String(e.id) === especialidad)?.nombre || "— Selecciona";
  const medicoLabel        = medicoSeleccionado ? `${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}` : "— Selecciona";
  const sedeLabel          = sedes.find(s => String(s.id) === sede)?.nombre || "— Selecciona";

  return (
    <Layout>
      <div className="ac-page-header">
        <h1>Agendar cita médica</h1>
        <p>Selecciona la especialidad, el médico, la fecha y el horario disponible.</p>
      </div>

      {alerta && (
        <div className={`ac-alerta ac-alerta-${alerta.tipo}`}>
          <div className="ac-alerta-icono">
            {alerta.tipo === "warning" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>}
            {alerta.tipo === "success" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>}
          </div>
          <div className="ac-alerta-texto"><strong>{alerta.titulo}</strong><span>{alerta.mensaje}</span></div>
        </div>
      )}

      <div className="ac-grid">
        {/* FORMULARIO */}
        <div className="ac-form-section">

          <div className="ac-form-row">
            <div className="ac-field">
              <label>Especialidad médica</label>
              <div className={`ac-input-wrap${errores.especialidad ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <select value={especialidad} onChange={e => { setEspecialidad(e.target.value); setErrores(p => ({...p, especialidad: false})); }}>
                  <option value="" disabled>Selecciona una especialidad</option>
                  {especialidades.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
              </div>
            </div>
            <div className="ac-field">
              <label>Médico disponible</label>
              <div className={`ac-input-wrap${errores.medico ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <select value={medico} onChange={e => { setMedico(e.target.value); setErrores(p => ({...p, medico: false})); }}>
                  <option value="" disabled>Selecciona un médico</option>
                  {medicos.map(m => <option key={m.id} value={m.id}>{m.nombre} {m.apellido} — {m.especialidad}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="ac-form-row">
            <div className="ac-field">
              <label>Modalidad</label>
              <div className={`ac-input-wrap${errores.modalidad ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                <select value={modalidad} onChange={e => { setModalidad(e.target.value); setErrores(p => ({...p, modalidad: false})); }}>
                  <option value="" disabled>Selecciona modalidad</option>
                  <option value="presencial">Presencial</option>
                  <option value="virtual">Virtual</option>
                </select>
              </div>
            </div>
            {modalidad === "presencial" && (
              <div className="ac-field">
                <label>Sede</label>
                <div className="ac-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <select value={sede} onChange={e => setSede(e.target.value)}>
                    <option value="">Selecciona una sede</option>
                    {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="ac-field" style={{ marginBottom: "1rem" }}>
            <label>Motivo de consulta <span className="ac-opcional">(opcional)</span></label>
            <div className="ac-textarea-wrap">
              <textarea
                placeholder="Describe brevemente el motivo de tu consulta..."
                maxLength={200}
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
              />
              <span className="ac-char-count">{motivo.length}/200</span>
            </div>
          </div>

          {/* CALENDARIO Y HORARIOS */}
          <div className="ac-cal-horarios">
            <div className="ac-calendario">
              <div className="ac-cal-header">
                <button onClick={() => setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1))}>‹</button>
                <span>{MESES[fechaActual.getMonth()]} {fechaActual.getFullYear()}</span>
                <button onClick={() => setFechaActual(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1))}>›</button>
              </div>
              <div className="ac-cal-nombres">
                {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="ac-cal-dias">
                {generarDias().map((dia, i) => (
                  <div
                    key={i}
                    className={`ac-cal-dia${dia.vacio ? " vacio" : ""}${dia.pasado ? " no-disponible" : ""}${diaSeleccionado === dia.str ? " seleccionado" : ""}`}
                    onClick={() => { if (!dia.vacio && !dia.pasado) { setDiaSeleccionado(dia.str); setErrores(p => ({...p, fecha: false})); }}}
                  >
                    {dia.vacio ? "" : dia.d}
                  </div>
                ))}
              </div>
            </div>

            <div className="ac-horarios-wrap">
              <p className="ac-horarios-titulo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Horarios disponibles
              </p>
              <div className="ac-horarios-grid">
                {HORARIOS.map(h => (
                  <button
                    key={h}
                    className={`ac-horario-btn${horario === h ? " active" : ""}`}
                    onClick={() => { setHorario(h); setErrores(p => ({...p, horario: false})); }}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="ac-form-btns">
            <button className="ac-btn-cancelar" onClick={() => navigate("/dashboard")}>Cancelar</button>
            <button className="ac-btn-agendar" onClick={agendarCita}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Agendar cita
            </button>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="ac-resumen">
          <h3>Resumen de la cita</h3>
          <div className="ac-resumen-items">
            {[
              { label: "Especialidad", valor: especialidadLabel, icono: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
              { label: "Médico",       valor: medicoLabel,       icono: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
              { label: "Fecha",        valor: diaSeleccionado    || "— Selecciona", icono: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
              { label: "Hora",         valor: horario            || "— Selecciona", icono: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
              { label: "Modalidad",    valor: modalidad          || "— Selecciona", icono: <><rect x="2" y="3" width="20" height="14" rx="2"/></> },
              { label: "Sede",         valor: sedeLabel,         icono: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
            ].map(({ label, valor, icono }) => (
              <div className="ac-resumen-item" key={label}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" width="16" height="16">{icono}</svg>
                <div>
                  <span className="ac-resumen-label">{label}</span>
                  <p className="ac-resumen-valor">{valor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}