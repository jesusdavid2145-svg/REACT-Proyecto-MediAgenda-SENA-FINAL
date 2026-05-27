import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const styles = `
.saludo { margin-bottom:1.5rem; }
.saludo h1 { font-size:1.6rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.saludo p  { font-size:0.875rem; color:#6b7280; }

.cards-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1rem; margin-bottom:1.5rem; }
.summary-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.summary-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:0.75rem; }
.summary-icon svg { width:22px; height:22px; }
.summary-icon.blue   { background:#eff6ff; color:#1a56db; }
.summary-icon.green  { background:#f0fdf4; color:#16a34a; }
.summary-icon.orange { background:#fff7ed; color:#fb923c; }
.summary-icon.teal   { background:#f0fdfa; color:#0d9488; }
.summary-label  { font-size:0.78rem; color:#6b7280; font-weight:500; margin-bottom:0.25rem; }
.summary-number { font-size:2rem; font-weight:700; line-height:1; margin-bottom:0.25rem; }
.summary-number.blue   { color:#1a56db; }
.summary-number.green  { color:#16a34a; }
.summary-number.orange { color:#fb923c; }
.summary-number.teal   { font-size:1.1rem; color:#0d9488; }
.summary-sub  { font-size:0.78rem; color:#9ca3af; margin-bottom:0.25rem; }
.summary-link { font-size:0.78rem; color:#1a56db; text-decoration:none; font-weight:600; display:block; margin-top:0.5rem; cursor:pointer; }
.summary-link:hover { text-decoration:underline; }

.dash-content-grid { display:grid; grid-template-columns:1fr 280px; gap:1.5rem; }

.citas-section { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
.section-header h2 { font-size:1rem; font-weight:700; color:#0f172a; }
.section-header a { font-size:0.82rem; color:#1a56db; text-decoration:none; font-weight:500; cursor:pointer; }
.section-header a:hover { text-decoration:underline; }
.tabla-wrap { overflow-x:auto; }
table { width:100%; border-collapse:collapse; font-size:0.85rem; }
thead th { text-align:left; padding:0.6rem 0.75rem; color:#6b7280; font-weight:600; font-size:0.78rem; border-bottom:1px solid #f1f5f9; }
tbody tr { border-bottom:1px solid #f8fafc; transition:background 0.15s; }
tbody tr:hover { background:#f8fafc; }
tbody td { padding:0.75rem; color:#374151; vertical-align:middle; }

.estado-badge { padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:600; text-transform:capitalize; }
.estado-confirmada { background:#f0fdf4; color:#16a34a; }
.estado-pendiente  { background:#fff7ed; color:#d97706; }
.estado-cancelada  { background:#fef2f2; color:#dc2626; }
.estado-completada { background:#f0f5ff; color:#1a56db; }

.right-panel { display:flex; flex-direction:column; gap:1rem; }
.panel-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.panel-card h3 { font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:1rem; }
.accion-item { display:flex; align-items:center; gap:10px; padding:0.65rem 0.5rem; border-radius:10px; text-decoration:none; transition:background 0.15s; margin-bottom:0.25rem; cursor:pointer; }
.accion-item:hover { background:#f8fafc; }
.accion-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.accion-icon.blue   { background:#eff6ff; color:#1a56db; }
.accion-icon.green  { background:#f0fdf4; color:#16a34a; }
.accion-icon.purple { background:#f5f3ff; color:#7c3aed; }
.accion-text { flex:1; }
.accion-text strong { font-size:0.85rem; font-weight:600; color:#1e293b; display:block; }
.accion-text span   { font-size:0.75rem; color:#9ca3af; }
.consejo-card { background:#f0f5ff; border-color:#c7d7f9; }
.consejo-body { display:flex; align-items:flex-start; gap:10px; margin-bottom:0.5rem; }
.consejo-icon { width:48px; height:48px; border-radius:12px; background:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.consejo-body p { font-size:0.85rem; color:#1e293b; font-weight:500; line-height:1.5; }
.consejo-sub { font-size:0.78rem; color:#6b7280; font-style:italic; }
`;

export default function Dashboard() {
  const navigate                    = useNavigate();
  const { token, nombreCompleto }   = useAuth();
  const [citas, setCitas]           = useState([]);
  const [totalCitas, setTotalCitas] = useState(0);
  const [proximas, setProximas]     = useState(0);
  const [cargando, setCargando]     = useState(true);

  // Inyectar estilos
  useEffect(() => {
    if (document.getElementById("dashboard-styles")) return;
    const tag = document.createElement("style");
    tag.id        = "dashboard-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  // Cargar citas desde el backend
  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`${API}/citas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) return;

        const proximasCitas = data.filter(c => c.estado === "pendiente" || c.estado === "confirmada");
        setTotalCitas(data.length);
        setProximas(proximasCitas.length);
        setCitas(proximasCitas.slice(0, 5));
      } catch (err) {
        console.error("Error cargando citas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [token]);

  const primerNombre = nombreCompleto.split(" ")[0];

  return (
    <Layout>
      {/* SALUDO */}
      <div className="saludo">
        <h1>Hola, <span style={{ color: "#1a56db" }}>{primerNombre}</span> 👋</h1>
        <p>Este es el resumen de tu actividad en MediAgenda.</p>
      </div>

      {/* TARJETAS RESUMEN */}
      <div className="cards-grid">
        <div className="summary-card">
          <div className="summary-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <p className="summary-label">Próxima cita</p>
          <p className="summary-number blue">{totalCitas}</p>
          <p className="summary-sub">Citas en total</p>
          <span className="summary-link" onClick={() => navigate("/mis-citas")}>Ver detalles ›</span>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          </div>
          <p className="summary-label">Citas programadas</p>
          <p className="summary-number green">{proximas}</p>
          <p className="summary-sub">Pendientes o confirmadas</p>
          <span className="summary-link" onClick={() => navigate("/mis-citas")}>Ver mis citas ›</span>
        </div>

        <div className="summary-card">
          <div className="summary-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <p className="summary-label">Notificaciones</p>
          <p className="summary-number orange">3</p>
          <p className="summary-sub">Pendientes</p>
          <span className="summary-link" onClick={() => navigate("/notificaciones")}>Ver notificaciones ›</span>
        </div>

        <div className="summary-card">
          <div className="summary-icon teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <p className="summary-label">Historial clínico</p>
          <p className="summary-number teal">Ver</p>
          <p className="summary-sub">Tu historial médico</p>
          <span className="summary-link" onClick={() => navigate("/historial")}>Ver historial ›</span>
        </div>
      </div>

      {/* GRID CONTENIDO */}
      <div className="dash-content-grid">

        {/* TABLA PRÓXIMAS CITAS */}
        <div className="citas-section">
          <div className="section-header">
            <h2>Próximas citas</h2>
            <a onClick={() => navigate("/mis-citas")}>Ver todas</a>
          </div>
          <div className="tabla-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Médico</th>
                  <th>Especialidad</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Cargando citas...</td></tr>
                ) : citas.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No tienes citas próximas.</td></tr>
                ) : citas.map((c, i) => (
                  <tr key={i}>
                    <td>{c.fecha}</td>
                    <td>{c.hora}</td>
                    <td>{c.medico_nombre} {c.medico_apellido}</td>
                    <td>{c.especialidad}</td>
                    <td><span className={`estado-badge estado-${c.estado}`}>{c.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="right-panel">
          <div className="panel-card">
            <h3>Acciones rápidas</h3>
            <div className="accion-item" onClick={() => navigate("/agendar")}>
              <div className="accion-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div className="accion-text"><strong>Agendar nueva cita</strong><span>Reservar una cita médica</span></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div className="accion-item" onClick={() => navigate("/historial")}>
              <div className="accion-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div className="accion-text"><strong>Ver historial clínico</strong><span>Consultar tu información</span></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div className="accion-item" onClick={() => navigate("/ajustes")}>
              <div className="accion-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div className="accion-text"><strong>Actualizar perfil</strong><span>Editar tus datos personales</span></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>

          <div className="panel-card consejo-card">
            <h3>Consejo de salud</h3>
            <div className="consejo-body">
              <div className="consejo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" width="28" height="28"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <p>Mantén al día tus controles médicos y vive más saludable.</p>
            </div>
            <p className="consejo-sub">La prevención es el mejor cuidado.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
