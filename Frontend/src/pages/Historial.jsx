import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const TABS = ["resumen","antecedentes","alergias","medicacion","consultas","examenes"];
const TABS_LABELS = ["Resumen clínico","Antecedentes","Alergias","Medicación actual","Consultas previas","Exámenes y resultados"];

const ROLES = { paciente: "Paciente", medico: "Médico tratante", administrador: "Administrador" };

const styles = `
.hi-page-header { margin-bottom:1.25rem; }
.hi-page-header h1 { font-size:1.5rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.hi-page-header p  { font-size:0.875rem; color:#6b7280; }

.hi-alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.hi-alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hi-alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.hi-alerta-texto span { font-size:0.82rem; font-weight:400; }
.hi-alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.hi-alerta-success .hi-alerta-icono { background:#16a34a; }
.hi-alerta-success .hi-alerta-texto strong { color:#15803d; }
.hi-alerta-success .hi-alerta-texto span { color:#166534; }

.hi-grid { display:grid; grid-template-columns:1fr 260px; gap:1.5rem; align-items:start; }
.hi-main { min-width:0; }

.hi-paciente-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
.hi-paciente-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:1.2rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hi-paciente-info { flex:1; min-width:160px; }
.hi-paciente-info h2 { font-size:1.15rem; font-weight:700; color:#0f172a; margin-bottom:2px; }
.hi-paciente-doc { font-size:0.82rem; color:#6b7280; margin-bottom:0.5rem; }
.hi-tag { background:#eff6ff; color:#1a56db; font-size:0.75rem; font-weight:600; padding:3px 10px; border-radius:999px; }

.hi-tabs-wrap { display:flex; border-bottom:2px solid #e2e8f4; margin-bottom:1rem; overflow-x:auto; }
.hi-tab { padding:0.65rem 1rem; font-size:0.82rem; font-weight:500; color:#6b7280; background:none; border:none; cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-2px; white-space:nowrap; font-family:inherit; transition:color 0.15s,border-color 0.15s; }
.hi-tab:hover { color:#1a56db; }
.hi-tab.active { color:#1a56db; border-bottom-color:#1a56db; font-weight:600; }

.hi-tab-content { display:none; }
.hi-tab-content.active { display:block; }

.hi-tabla-section { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); margin-bottom:1rem; }
.hi-tabla-section h3 { font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:1rem; }
.hi-tabla-wrap { overflow-x:auto; }
.hi-tabla { width:100%; border-collapse:collapse; font-size:0.85rem; }
.hi-tabla thead th { text-align:left; padding:0.6rem 0.75rem; color:#6b7280; font-weight:600; font-size:0.78rem; border-bottom:1px solid #f1f5f9; }
.hi-tabla tbody tr { border-bottom:1px solid #f8fafc; transition:background 0.15s; }
.hi-tabla tbody tr:hover { background:#f8fafc; }
.hi-tabla tbody td { padding:0.75rem; color:#374151; vertical-align:middle; }

.estado-badge { padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:600; text-transform:capitalize; }
.estado-completada { background:#f0f5ff; color:#1a56db; }

.hi-aviso-privacidad { display:flex; align-items:flex-start; gap:10px; background:#fffbeb; border:1px solid #fcd34d; border-radius:10px; padding:0.85rem 1rem; font-size:0.82rem; color:#78350f; line-height:1.5; margin-top:1rem; }

.hi-aside { display:flex; flex-direction:column; gap:1rem; position:sticky; top:80px; }
.hi-aside-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.hi-acceso-card { border-color:#bbf7d0; background:#f0fdf4; }
.hi-acceso-header { display:flex; align-items:center; gap:8px; margin-bottom:0.75rem; }
.hi-acceso-header strong { font-size:0.875rem; font-weight:700; color:#15803d; }
.hi-acceso-detalle { display:flex; flex-direction:column; gap:6px; }
.hi-acc-item { display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; }
.hi-acc-label { color:#6b7280; }
.hi-acc-valor  { font-weight:600; color:#1e293b; }
`;

export default function Historial() {
  const { token, usuario, iniciales, nombreCompleto } = useAuth();
  const [tabActiva,  setTabActiva]  = useState("resumen");
  const [consultas,  setConsultas]  = useState([]);
  const [cargando,   setCargando]   = useState(true);

  const rol      = usuario?.rol || "paciente";
  const rolLabel = ROLES[rol] || "Paciente";

  const ahora = new Date();
  const fechaAcceso = ahora.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    + " · " + ahora.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (document.getElementById("hi-styles")) return;
    const tag = document.createElement("style");
    tag.id = "hi-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res  = await fetch(`${API}/citas`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) return;
        setConsultas(data.filter(c => c.estado === "completada"));
      } catch (err) { console.error(err); }
      finally { setCargando(false); }
    };
    cargar();
  }, [token]);

  return (
    <Layout>
      <div className="hi-page-header">
        <h1>Historial clínico</h1>
        <p>Solo los usuarios autorizados pueden consultar información médica sensible.</p>
      </div>

      {/* ALERTA ACCESO */}
      <div className="hi-alerta hi-alerta-success">
        <div className="hi-alerta-icono">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="hi-alerta-texto">
          <strong>Acceso registrado</strong>
          <span>Acceso registrado como {rolLabel} el {fechaAcceso}.</span>
        </div>
      </div>

      <div className="hi-grid">
        <div className="hi-main">

          {/* PACIENTE CARD */}
          <div className="hi-paciente-card">
            <div className="hi-paciente-avatar">{iniciales}</div>
            <div className="hi-paciente-info">
              <h2>{nombreCompleto}</h2>
              <div className="hi-paciente-doc" style={{ marginBottom: "0.5rem" }}>
                {usuario?.correo || ""}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span className="hi-tag">{rolLabel}</span>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="hi-tabs-wrap">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`hi-tab${tabActiva === tab ? " active" : ""}`}
                onClick={() => setTabActiva(tab)}
              >
                {TABS_LABELS[i]}
              </button>
            ))}
          </div>

          {/* TAB: RESUMEN */}
          <div className={`hi-tab-content${tabActiva === "resumen" ? " active" : ""}`}>
            <p style={{ color: "#6b7280", padding: "1rem 0", fontSize: "0.875rem" }}>
              El resumen clínico se generará a partir de las consultas registradas en el sistema.
            </p>
          </div>

          {/* TAB: ANTECEDENTES */}
          <div className={`hi-tab-content${tabActiva === "antecedentes" ? " active" : ""}`}>
            <p style={{ color: "#6b7280", padding: "1rem 0", fontSize: "0.875rem" }}>
              Sin antecedentes registrados.
            </p>
          </div>

          {/* TAB: ALERGIAS */}
          <div className={`hi-tab-content${tabActiva === "alergias" ? " active" : ""}`}>
            <p style={{ color: "#6b7280", padding: "1rem 0", fontSize: "0.875rem" }}>
              Sin alergias registradas.
            </p>
          </div>

          {/* TAB: MEDICACIÓN */}
          <div className={`hi-tab-content${tabActiva === "medicacion" ? " active" : ""}`}>
            <p style={{ color: "#6b7280", padding: "1rem 0", fontSize: "0.875rem" }}>
              Sin medicación activa registrada.
            </p>
          </div>

          {/* TAB: CONSULTAS PREVIAS */}
          <div className={`hi-tab-content${tabActiva === "consultas" ? " active" : ""}`}>
            <div className="hi-tabla-section">
              <h3>Consultas previas</h3>
              <div className="hi-tabla-wrap">
                <table className="hi-tabla">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Médico</th>
                      <th>Especialidad</th>
                      <th>Modalidad</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargando ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>Cargando consultas...</td></tr>
                    ) : consultas.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No hay consultas previas registradas.</td></tr>
                    ) : consultas.map((c, i) => (
                      <tr key={i}>
                        <td>{c.fecha}</td>
                        <td>{c.medico_nombre} {c.medico_apellido}</td>
                        <td>{c.especialidad}</td>
                        <td>{c.modalidad}</td>
                        <td><span className="estado-badge estado-completada">Completada</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TAB: EXÁMENES */}
          <div className={`hi-tab-content${tabActiva === "examenes" ? " active" : ""}`}>
            <p style={{ color: "#6b7280", padding: "1rem 0", fontSize: "0.875rem" }}>
              Sin exámenes registrados.
            </p>
          </div>

          {/* AVISO PRIVACIDAD */}
          <div className="hi-aviso-privacidad">
            <svg viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
            <p><strong>Aviso de privacidad:</strong> el acceso al historial clínico está restringido a usuarios autorizados.</p>
          </div>
        </div>

        {/* ASIDE */}
        <div className="hi-aside">
          <div className="hi-aside-card hi-acceso-card">
            <div className="hi-acceso-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <strong>Acceso autorizado</strong>
            </div>
            <div className="hi-acceso-detalle">
              <div className="hi-acc-item">
                <span className="hi-acc-label">Rol de acceso</span>
                <span className="hi-acc-valor">{rolLabel}</span>
              </div>
              <div className="hi-acc-item">
                <span className="hi-acc-label">Acceso registrado</span>
                <span className="hi-acc-valor">{fechaAcceso}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}