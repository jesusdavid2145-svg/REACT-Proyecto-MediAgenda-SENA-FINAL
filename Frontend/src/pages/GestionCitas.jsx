import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const styles = `
.page-header { margin-bottom:1.25rem; }
.page-header h1 { font-size:1.5rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.page-header p  { font-size:0.875rem; color:#6b7280; }

.alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.alerta-texto span { font-size:0.82rem; font-weight:400; }
.alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.alerta-success .alerta-icono { background:#16a34a; }
.alerta-success .alerta-texto strong { color:#15803d; }
.alerta-success .alerta-texto span { color:#166534; }
.alerta-error { background:#fef2f2; border:1px solid #fecaca; }
.alerta-error .alerta-icono { background:#ef4444; }
.alerta-error .alerta-texto strong { color:#b91c1c; }
.alerta-error .alerta-texto span { color:#991b1b; }

.gc-filtros-card { background:#fff; border-radius:14px; padding:1rem 1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); display:flex; align-items:center; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap; }
.gc-filtro-item { flex:1; min-width:160px; }
.gc-filtro-input-wrap { display:flex; align-items:center; gap:8px; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; background:#fafbff; }
.gc-filtro-input-wrap:focus-within { border-color:#1a56db; box-shadow:0 0 0 3px rgba(26,86,219,0.1); }
.gc-filtro-input-wrap input { flex:1; border:none; background:transparent; padding:9px 0; font-size:0.85rem; color:#1e293b; outline:none; font-family:inherit; }
.gc-filtro-input-wrap input::placeholder { color:#c4c9d4; }
.gc-filtro-select-wrap { display:flex; align-items:center; gap:8px; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; background:#fafbff; }
.gc-filtro-select-wrap select { flex:1; border:none; background:transparent; padding:9px 4px; font-size:0.85rem; color:#1e293b; outline:none; font-family:inherit; cursor:pointer; appearance:none; }
.gc-btn-buscar { display:flex; align-items:center; gap:6px; padding:9px 20px; background:#1a56db; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; white-space:nowrap; }
.gc-btn-buscar:hover { background:#1648c0; }

.gc-content-grid { display:grid; grid-template-columns:1fr 260px; gap:1.5rem; align-items:start; }

.gc-citas-section { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.gc-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
.gc-section-header h2 { font-size:1rem; font-weight:700; color:#0f172a; }
.gc-ordenar-wrap { display:flex; align-items:center; gap:8px; font-size:0.82rem; color:#6b7280; }
.gc-ordenar-wrap select { border:1.5px solid #e2e8f0; border-radius:8px; padding:5px 10px; font-size:0.82rem; color:#374151; font-family:inherit; outline:none; cursor:pointer; background:#fafbff; }

.gc-tabla-wrap { overflow-x:auto; margin-bottom:1rem; }
.gc-tabla { width:100%; border-collapse:collapse; font-size:0.85rem; }
.gc-tabla thead th { text-align:left; padding:0.6rem 0.75rem; color:#6b7280; font-weight:600; font-size:0.78rem; border-bottom:1px solid #f1f5f9; white-space:nowrap; }
.gc-tabla tbody tr { border-bottom:1px solid #f8fafc; transition:background 0.15s; }
.gc-tabla tbody tr:hover { background:#f8fafc; }
.gc-tabla tbody td { padding:0.85rem 0.75rem; color:#374151; vertical-align:middle; }

.estado-badge { padding:4px 10px; border-radius:999px; font-size:0.75rem; font-weight:600; white-space:nowrap; text-transform:capitalize; }
.estado-confirmada { background:#f0fdf4; color:#16a34a; }
.estado-pendiente  { background:#fff7ed; color:#d97706; }
.estado-cancelada  { background:#fef2f2; color:#dc2626; }
.estado-completada { background:#f0f5ff; color:#1a56db; }
.estado-no_asistio { background:#fef2f2; color:#dc2626; }

.gc-acciones-cell { display:flex; align-items:center; gap:6px; }
.gc-btn-cancelar { display:flex; align-items:center; gap:4px; padding:5px 10px; border-radius:7px; font-size:0.75rem; font-weight:600; border:none; cursor:pointer; font-family:inherit; transition:opacity 0.15s; background:#fef2f2; color:#dc2626; }
.gc-btn-cancelar:hover { background:#fee2e2; }

.gc-aviso { display:flex; align-items:flex-start; gap:12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:0.85rem 1rem; margin-top:1rem; }
.gc-aviso strong { font-size:0.85rem; font-weight:600; color:#1e40af; display:block; margin-bottom:2px; }
.gc-aviso p { font-size:0.8rem; color:#3b82f6; }

.gc-resumen-panel { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); position:sticky; top:80px; }
.gc-resumen-panel h3 { font-size:0.95rem; font-weight:700; color:#0f172a; margin-bottom:1rem; }
.gc-resumen-items { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem; }
.gc-resumen-card { display:flex; align-items:center; gap:12px; padding:0.75rem; border-radius:10px; }
.gc-resumen-card.blue { background:#eff6ff; }
.gc-resumen-card.red  { background:#fef2f2; }
.gc-resumen-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.gc-resumen-icon.blue { background:#dbeafe; color:#1a56db; }
.gc-resumen-icon.red  { background:#fecaca; color:#dc2626; }
.gc-resumen-num { font-size:1.4rem; font-weight:700; line-height:1; }
.gc-resumen-num.blue { color:#1a56db; }
.gc-resumen-num.red  { color:#dc2626; }
.gc-resumen-label { font-size:0.82rem; font-weight:600; color:#1e293b; }
.gc-resumen-sub   { font-size:0.75rem; color:#9ca3af; }
.gc-btn-nueva { display:block; width:100%; text-align:center; padding:10px; background:#1a56db; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; margin-top:0.75rem; }
.gc-btn-nueva:hover { background:#1648c0; }

.modal-overlay { display:none; position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:999; align-items:center; justify-content:center; }
.modal-overlay.active { display:flex; }
.modal-box-small { background:#fff; border-radius:20px; padding:2rem; width:90%; max-width:400px; text-align:center; box-shadow:0 8px 40px rgba(0,0,0,0.15); }
.modal-icono-warning { width:68px; height:68px; border-radius:50%; background:#fb923c; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
.modal-box-small h3 { font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem; }
.modal-box-small p  { font-size:0.875rem; color:#6b7280; line-height:1.6; }
.modal-btns-row { display:flex; gap:0.75rem; justify-content:center; margin-top:1.25rem; }
.btn-modal-secundario { padding:9px 20px; background:transparent; color:#6b7280; font-size:0.875rem; font-weight:600; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; }
.btn-modal-secundario:hover { background:#f8fafc; }
.btn-modal-danger { padding:9px 20px; background:#ef4444; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; }
.btn-modal-danger:hover { background:#dc2626; }
`;

export default function GestionCitas() {
  const navigate              = useNavigate();
  const { token }             = useAuth();
  const [citas, setCitas]     = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [buscar, setBuscar]   = useState("");
  const [estado, setEstado]   = useState("");
  const [ordenar, setOrdenar] = useState("proximas");
  const [alerta, setAlerta]   = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [citaAcancelar, setCitaACantelar] = useState(null);

  useEffect(() => {
    if (document.getElementById("gc-styles")) return;
    const tag = document.createElement("style");
    tag.id = "gc-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => { cargarCitas(); }, [token]);

  const cargarCitas = async () => {
    try {
      const res  = await fetch(`${API}/citas`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) return;
      setCitas(data);
      setFiltradas(data);
    } catch (err) { console.error(err); }
  };

  const filtrarCitas = () => {
    let resultado = [...citas];
    if (buscar) resultado = resultado.filter(c =>
      `${c.medico_nombre} ${c.medico_apellido} ${c.especialidad}`.toLowerCase().includes(buscar.toLowerCase())
    );
    if (estado) resultado = resultado.filter(c => c.estado === estado);
    if (ordenar === "proximas") resultado.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    else if (ordenar === "recientes") resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    else if (ordenar === "estado") resultado.sort((a, b) => a.estado.localeCompare(b.estado));
    setFiltradas(resultado);
  };

  useEffect(() => { filtrarCitas(); }, [buscar, estado, ordenar, citas]);

  const abrirModalCancelar = (id) => {
    setCitaACantelar(id);
    setModalAbierto(true);
  };

  const confirmarCancelacion = async () => {
    setModalAbierto(false);
    try {
      const res  = await fetch(`${API}/citas/cancelar/${citaACantelar}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ motivo_cancel: "Cancelada por el paciente" }),
      });
      const data = await res.json();
      if (!res.ok) { mostrarAlerta("error", "Error", data.error || "No se pudo cancelar."); return; }
      mostrarAlerta("success", "Cita cancelada", "La cita fue cancelada correctamente.");
      cargarCitas();
    } catch { mostrarAlerta("error", "Error de conexión", "No se pudo conectar con el servidor."); }
  };

  const mostrarAlerta = (tipo, titulo, mensaje) => {
    setAlerta({ tipo, titulo, mensaje });
    setTimeout(() => setAlerta(null), 4000);
  };

  const proximas = filtradas.filter(c => c.estado === "pendiente" || c.estado === "confirmada").length;

  return (
    <Layout>
      <div className="page-header">
        <h1>Gestión de citas</h1>
        <p>Consulta, filtra, modifica o cancela tus citas médicas de forma rápida y organizada.</p>
      </div>

      {alerta && (
        <div className={`alerta alerta-${alerta.tipo}`}>
          <div className="alerta-icono">
            {alerta.tipo === "success" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>}
            {alerta.tipo === "error"   && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          </div>
          <div className="alerta-texto"><strong>{alerta.titulo}</strong><span>{alerta.mensaje}</span></div>
        </div>
      )}

      {/* FILTROS */}
      <div className="gc-filtros-card">
        <div className="gc-filtro-item">
          <div className="gc-filtro-input-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Buscar por médico, especialidad..." value={buscar} onChange={e => setBuscar(e.target.value)} />
          </div>
        </div>
        <div className="gc-filtro-item">
          <div className="gc-filtro-select-wrap">
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="">Todos los estados</option>
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        </div>
        <button className="gc-btn-buscar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Buscar
        </button>
      </div>

      <div className="gc-content-grid">
        {/* TABLA */}
        <div className="gc-citas-section">
          <div className="gc-section-header">
            <h2>Lista de citas</h2>
            <div className="gc-ordenar-wrap">
              <span>Ordenar por:</span>
              <select value={ordenar} onChange={e => setOrdenar(e.target.value)}>
                <option value="proximas">Próximas primero</option>
                <option value="recientes">Más recientes</option>
                <option value="estado">Por estado</option>
              </select>
            </div>
          </div>
          <div className="gc-tabla-wrap">
            <table className="gc-tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Hora</th><th>Especialidad</th>
                  <th>Médico</th><th>Modalidad</th><th>Estado</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: "center", padding: "2rem", color: "#9ca3af" }}>No tienes citas registradas.</td></tr>
                ) : filtradas.map(c => (
                  <tr key={c.id}>
                    <td>{c.fecha}</td>
                    <td>{c.hora}</td>
                    <td>{c.especialidad}</td>
                    <td>{c.medico_nombre} {c.medico_apellido}</td>
                    <td>{c.modalidad === "virtual" ? "🖥 Virtual" : "🏥 Presencial"}</td>
                    <td><span className={`estado-badge estado-${c.estado}`}>{c.estado}</span></td>
                    <td>
                      <div className="gc-acciones-cell">
                        {(c.estado === "pendiente" || c.estado === "confirmada") && (
                          <button className="gc-btn-cancelar" onClick={() => abrirModalCancelar(c.id)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            Cancelar
                          </button>
                        )}
                        {(c.estado !== "pendiente" && c.estado !== "confirmada") && <span style={{ color: "#9ca3af", fontSize: "0.82rem" }}>—</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="gc-aviso">
            <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <div>
              <strong>Gestiona tus citas fácilmente</strong>
              <p>Desde esta sección puedes revisar los detalles de tus citas, modificarlas o cancelarlas según lo necesites.</p>
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="gc-resumen-panel">
          <h3>Resumen</h3>
          <div className="gc-resumen-items">
            <div className="gc-resumen-card blue">
              <div className="gc-resumen-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p className="gc-resumen-num blue">{proximas}</p>
                <p className="gc-resumen-label">Citas programadas</p>
                <p className="gc-resumen-sub">Pendientes o confirmadas</p>
              </div>
            </div>
            <div className="gc-resumen-card red">
              <div className="gc-resumen-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </div>
              <div>
                <p className="gc-resumen-num red">{citas.filter(c => c.estado === "cancelada").length}</p>
                <p className="gc-resumen-label">Citas canceladas</p>
                <p className="gc-resumen-sub">En los últimos 30 días</p>
              </div>
            </div>
          </div>
          <button className="gc-btn-nueva" onClick={() => navigate("/agendar")}>+ Agendar nueva cita</button>
        </div>
      </div>

      {/* MODAL CANCELAR */}
      <div className={`modal-overlay${modalAbierto ? " active" : ""}`} onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false); }}>
        <div className="modal-box-small">
          <div className="modal-icono-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="28" height="28"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3>¿Cancelar esta cita?</h3>
          <p>Esta acción no se puede deshacer. La cita quedará registrada como cancelada.</p>
          <div className="modal-btns-row">
            <button className="btn-modal-secundario" onClick={() => setModalAbierto(false)}>No, mantener</button>
            <button className="btn-modal-danger" onClick={confirmarCancelacion}>Sí, cancelar cita</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}