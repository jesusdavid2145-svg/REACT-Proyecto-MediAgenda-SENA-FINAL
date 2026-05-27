import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const NOTIF_INICIALES = [
  { id: 0, tipo: "recordatorio", icono: "blue",   titulo: "Recordatorio de cita",    descripcion: "Tienes una cita de Medicina general mañana a las 10:30 AM.", fecha: "Hoy, 09:15 AM",  tag: "no-leida",  tagLabel: "No leída",   leida: false, archivada: false },
  { id: 1, tipo: "recordatorio", icono: "orange",  titulo: "Cita reprogramada",       descripcion: "Tu cita de Dermatología fue reprogramada.",                  fecha: "Ayer, 04:32 PM", tag: "importante", tagLabel: "Importante", leida: false, archivada: false },
  { id: 2, tipo: "sistema",      icono: "green",   titulo: "Confirmación de cita",    descripcion: "Tu cita médica fue confirmada correctamente.",               fecha: "Hace 2 días",    tag: "leida",      tagLabel: "Leída",      leida: true,  archivada: false },
  { id: 3, tipo: "sistema",      icono: "teal",    titulo: "Actualización de seguridad", descripcion: "Tu contraseña fue actualizada correctamente.",            fecha: "Hace 3 días",    tag: "sistema",    tagLabel: "Sistema",    leida: true,  archivada: false },
];

const styles = `
.nf-page-header { margin-bottom:1.25rem; }
.nf-page-header h1 { font-size:1.5rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.nf-page-header p  { font-size:0.875rem; color:#6b7280; }

.nf-alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.nf-alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.nf-alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.nf-alerta-texto span { font-size:0.82rem; font-weight:400; }
.nf-alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.nf-alerta-success .nf-alerta-icono { background:#16a34a; }
.nf-alerta-success .nf-alerta-texto strong { color:#15803d; }
.nf-alerta-success .nf-alerta-texto span { color:#166534; }
.nf-alerta-info { background:#eff6ff; border:1px solid #bfdbfe; }
.nf-alerta-info .nf-alerta-icono { background:#1a56db; }
.nf-alerta-info .nf-alerta-texto strong { color:#1e40af; }
.nf-alerta-info .nf-alerta-texto span { color:#1e3a8a; }

.nf-content-grid { display:grid; grid-template-columns:1fr 240px; gap:1.5rem; align-items:start; }

.nf-section { background:#fff; border-radius:14px; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); overflow:hidden; }
.nf-filtros-bar { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; border-bottom:1px solid #f1f5f9; gap:0.75rem; flex-wrap:wrap; }
.nf-filtros-left { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; }
.nf-filtro-btn { display:flex; align-items:center; gap:6px; padding:6px 12px; border:1.5px solid #e2e8f0; border-radius:8px; font-size:0.82rem; font-weight:500; color:#6b7280; background:#fff; cursor:pointer; font-family:inherit; transition:all 0.15s; }
.nf-filtro-btn:hover { border-color:#1a56db; color:#1a56db; background:#eff6ff; }
.nf-filtro-btn.active { border-color:#1a56db; color:#1a56db; background:#eff6ff; font-weight:600; }
.nf-btn-marcar { display:flex; align-items:center; gap:6px; padding:7px 14px; background:#1a56db; color:#fff; font-size:0.82rem; font-weight:600; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background 0.15s; white-space:nowrap; }
.nf-btn-marcar:hover { background:#1648c0; }

.nf-list-item { display:flex; align-items:flex-start; gap:14px; padding:1rem 1.25rem; border-bottom:1px solid #f8fafc; transition:background 0.15s; position:relative; }
.nf-list-item:hover { background:#f8fafc; }
.nf-list-item.unread { background:#f8fbff; }
.nf-list-item.unread:hover { background:#f0f5ff; }
.nf-punto { width:8px; height:8px; border-radius:50%; background:#1a56db; flex-shrink:0; margin-top:6px; }
.nf-punto.oculto { visibility:hidden; }
.nf-list-icono { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:1.1rem; }
.nf-list-icono.blue   { background:#eff6ff; }
.nf-list-icono.orange { background:#fff7ed; }
.nf-list-icono.green  { background:#f0fdf4; }
.nf-list-icono.teal   { background:#f0fdfa; }
.nf-list-icono.gray   { background:#f8fafc; }
.nf-list-body { flex:1; min-width:0; }
.nf-list-titulo { font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:3px; }
.nf-list-desc { font-size:0.82rem; color:#6b7280; line-height:1.5; margin-bottom:6px; }
.nf-list-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.nf-list-fecha { font-size:0.75rem; color:#9ca3af; }
.nf-tag { padding:2px 8px; border-radius:999px; font-size:0.72rem; font-weight:600; }
.nf-tag.no-leida   { background:#eff6ff; color:#1a56db; }
.nf-tag.importante { background:#fff7ed; color:#d97706; }
.nf-tag.leida      { background:#f8fafc; color:#64748b; }
.nf-tag.sistema    { background:#f0fdfa; color:#0d9488; }
.nf-list-acciones { display:flex; align-items:center; gap:4px; flex-shrink:0; }
.nf-btn-accion { width:32px; height:32px; border-radius:8px; background:none; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#9ca3af; transition:background 0.15s,color 0.15s; }
.nf-btn-accion:hover { background:#f1f5f9; color:#374151; }
.nf-empty { text-align:center; padding:3rem 1rem; color:#9ca3af; font-size:0.875rem; }

.nf-aside { display:flex; flex-direction:column; gap:1rem; position:sticky; top:80px; }
.nf-aside-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.nf-aside-card h4 { font-size:0.875rem; font-weight:700; color:#0f172a; margin-bottom:1rem; }
.nf-resumen-row { display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; color:#6b7280; margin-bottom:0.5rem; }
.nf-resumen-num { font-weight:700; font-size:1rem; color:#1a56db; }
.nf-pref-item { display:flex; align-items:center; gap:10px; padding:0.6rem 0.5rem; border-radius:8px; font-size:0.82rem; font-weight:500; color:#374151; text-decoration:none; transition:background 0.15s; cursor:pointer; background:none; border:none; width:100%; font-family:inherit; text-align:left; }
.nf-pref-item:hover { background:#f8fafc; color:#1a56db; }
`;

export default function Notificaciones() {
  const navigate          = useNavigate();
  const { token }         = useAuth();
  const [notifs, setNotifs] = useState(NOTIF_INICIALES);
  const [filtro, setFiltro] = useState("todas");
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (document.getElementById("nf-styles")) return;
    const tag = document.createElement("style");
    tag.id = "nf-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  // Intentar cargar del backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`${API}/notificaciones`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        if (data.length > 0) {
          setNotifs(data.map(n => ({
            id:          n.id,
            tipo:        n.tipo || "sistema",
            icono:       n.tipo === "cita" ? "blue" : n.tipo === "recordatorio" ? "orange" : "green",
            titulo:      n.titulo,
            descripcion: n.mensaje,
            fecha:       new Date(n.creado_en).toLocaleDateString("es-CO"),
            tag:         n.leida ? "leida" : "no-leida",
            tagLabel:    n.leida ? "Leída" : "No leída",
            leida:       n.leida === 1,
            archivada:   false,
          })));
        }
      } catch { /* usa datos locales */ }
    };
    cargar();
  }, [token]);

  const noLeidas = notifs.filter(n => !n.leida && !n.archivada).length;

  const lista = notifs.filter(n => {
    if (n.archivada) return false;
    if (filtro === "no-leida")     return !n.leida;
    if (filtro === "recordatorio") return n.tipo === "recordatorio";
    if (filtro === "sistema")      return n.tipo === "sistema";
    return true;
  });

  const marcarLeida = async (id) => {
    try {
      await fetch(`${API}/notificaciones/${id}/leer`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    } catch { /* continúa */ }
    setNotifs(prev => prev.map(n => n.id === id
      ? { ...n, leida: !n.leida, tag: !n.leida ? "leida" : "no-leida", tagLabel: !n.leida ? "Leída" : "No leída" }
      : n
    ));
    mostrarAlerta("success", "Actualizado", "Notificación marcada correctamente.");
  };

  const archivar = (id) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, archivada: true } : n));
    mostrarAlerta("info", "Archivada", "La notificación fue archivada.");
  };

  const marcarTodas = async () => {
    try {
      await fetch(`${API}/notificaciones/leer-todas`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    } catch { /* continúa */ }
    setNotifs(prev => prev.map(n => ({ ...n, leida: true, tag: "leida", tagLabel: "Leída" })));
    mostrarAlerta("success", "Todas leídas", "Todas las notificaciones fueron marcadas como leídas.");
  };

  const mostrarAlerta = (tipo, titulo, mensaje) => {
    setAlerta({ tipo, titulo, mensaje });
    setTimeout(() => setAlerta(null), 3500);
  };

  return (
    <Layout>
      <div className="nf-page-header">
        <h1>Notificaciones</h1>
        <p>Consulta avisos, recordatorios y actualizaciones importantes de tu cuenta.</p>
      </div>

      {alerta && (
        <div className={`nf-alerta nf-alerta-${alerta.tipo}`}>
          <div className="nf-alerta-icono">
            {alerta.tipo === "success" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>}
            {alerta.tipo === "info"    && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          </div>
          <div className="nf-alerta-texto"><strong>{alerta.titulo}</strong><span>{alerta.mensaje}</span></div>
        </div>
      )}

      <div className="nf-content-grid">
        {/* LISTA */}
        <div className="nf-section">
          <div className="nf-filtros-bar">
            <div className="nf-filtros-left">
              {[["todas","Todas"],["no-leida","No leídas"],["recordatorio","Recordatorios"],["sistema","Sistema"]].map(([val, label]) => (
                <button key={val} className={`nf-filtro-btn${filtro === val ? " active" : ""}`} onClick={() => setFiltro(val)}>
                  {label}
                </button>
              ))}
            </div>
            <button className="nf-btn-marcar" onClick={marcarTodas}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>
              Marcar todas como leídas
            </button>
          </div>

          {lista.length === 0 ? (
            <p className="nf-empty">No hay notificaciones en esta categoría.</p>
          ) : lista.map(n => (
            <div key={n.id} className={`nf-list-item${!n.leida ? " unread" : ""}`}>
              <div className={`nf-punto${n.leida ? " oculto" : ""}`} />
              <div className={`nf-list-icono ${n.icono}`}>🔔</div>
              <div className="nf-list-body">
                <p className="nf-list-titulo">{n.titulo}</p>
                <p className="nf-list-desc">{n.descripcion}</p>
                <div className="nf-list-meta">
                  <span className="nf-list-fecha">{n.fecha}</span>
                  <span className={`nf-tag ${n.tag}`}>{n.tagLabel}</span>
                </div>
              </div>
              <div className="nf-list-acciones">
                <button className="nf-btn-accion" title={n.leida ? "Marcar como no leída" : "Marcar como leída"} onClick={() => marcarLeida(n.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
                <button className="nf-btn-accion" title="Archivar" onClick={() => archivar(n.id)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ASIDE */}
        <div className="nf-aside">
          <div className="nf-aside-card">
            <h4>Resumen</h4>
            <div className="nf-resumen-row">
              <span>No leídas</span>
              <strong className="nf-resumen-num">{noLeidas}</strong>
            </div>
          </div>
          <div className="nf-aside-card">
            <h4>Acciones rápidas</h4>
            <button className="nf-pref-item" onClick={() => navigate("/agendar")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Agendar cita
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="nf-pref-item" onClick={() => navigate("/mis-citas")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Mis citas
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="nf-pref-item" onClick={() => navigate("/ajustes")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="3"/></svg>
              Ajustes
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}