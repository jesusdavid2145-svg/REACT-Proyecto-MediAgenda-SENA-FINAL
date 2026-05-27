import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const REPORTES_INICIALES = [
  { fecha: "Hoy, 10:32 AM",  tipo: "Resumen de citas",       rango: "01 May - 31 May 2026", generadoPor: "Admin",  iniciales: "AD", estado: "completado", formato: "pdf"   },
  { fecha: "Ayer, 04:15 PM", tipo: "Actividad de médicos",   rango: "01 May - 31 May 2026", generadoPor: "Sistema",iniciales: "SI", estado: "completado", formato: "excel" },
  { fecha: "Hace 2 días",    tipo: "Citas por especialidad", rango: "01 May - 31 May 2026", generadoPor: "Sistema",iniciales: "SI", estado: "en-proceso", formato: "pdf"   },
];

const styles = `
.rp-page-header { margin-bottom:1rem; }
.rp-page-header h1 { font-size:1.4rem; font-weight:700; color:#0f172a; margin-bottom:0.2rem; }
.rp-page-header p  { font-size:0.85rem; color:#6b7280; }

.rp-alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.rp-alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.rp-alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.rp-alerta-texto span { font-size:0.82rem; font-weight:400; }
.rp-alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.rp-alerta-success .rp-alerta-icono { background:#16a34a; }
.rp-alerta-success .rp-alerta-texto strong { color:#15803d; }
.rp-alerta-success .rp-alerta-texto span { color:#166534; }
.rp-alerta-info { background:#eff6ff; border:1px solid #bfdbfe; }
.rp-alerta-info .rp-alerta-icono { background:#1a56db; }
.rp-alerta-info .rp-alerta-texto strong { color:#1e40af; }
.rp-alerta-info .rp-alerta-texto span { color:#1e3a8a; }
.rp-alerta-error { background:#fef2f2; border:1px solid #fecaca; }
.rp-alerta-error .rp-alerta-icono { background:#ef4444; }
.rp-alerta-error .rp-alerta-texto strong { color:#b91c1c; }
.rp-alerta-error .rp-alerta-texto span { color:#991b1b; }

.rp-filtros-card { background:#fff; border-radius:14px; padding:1rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); margin-bottom:1rem; }
.rp-filtros-row { display:grid; grid-template-columns:repeat(4,1fr); gap:0.75rem; margin-bottom:0.75rem; }
.rp-filtro-item label { font-size:0.75rem; font-weight:600; color:#374151; display:block; margin-bottom:4px; }
.rp-filtro-select { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 10px; background:#fafbff; }
.rp-filtro-select select { flex:1; border:none; background:transparent; padding:8px 4px; font-size:0.8rem; color:#1e293b; outline:none; font-family:inherit; cursor:pointer; appearance:none; }
.rp-filtros-btns { display:flex; align-items:center; gap:0.75rem; justify-content:flex-end; flex-wrap:wrap; }
.rp-btn-limpiar { padding:8px 14px; background:transparent; color:#6b7280; font-size:0.82rem; font-weight:500; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.rp-btn-limpiar:hover { background:#f8fafc; }
.rp-btn-generar { padding:8px 16px; background:#1a56db; color:#fff; font-size:0.82rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.rp-btn-generar:hover { background:#1648c0; }
.rp-btn-exportar-wrap { position:relative; }
.rp-btn-exportar { display:flex; align-items:center; gap:6px; padding:8px 14px; background:#1a56db; color:#fff; font-size:0.82rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.rp-btn-exportar:hover { background:#1648c0; }
.rp-exportar-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:#fff; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.12); border:1px solid #e2e8f4; overflow:hidden; z-index:100; min-width:170px; }
.rp-exportar-dropdown button { display:block; width:100%; padding:0.75rem 1rem; font-size:0.82rem; font-weight:500; color:#374151; background:none; border:none; cursor:pointer; font-family:inherit; transition:background 0.15s; text-align:left; }
.rp-exportar-dropdown button:hover { background:#f8fafc; }

.rp-content-grid { display:grid; grid-template-columns:1fr 220px; gap:1rem; align-items:start; }
.rp-main-col { min-width:0; }
.rp-aside-col { display:flex; flex-direction:column; gap:0.75rem; position:sticky; top:80px; }

.rp-metricas-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; margin-bottom:1rem; }
.rp-metrica-card { background:#fff; border-radius:12px; padding:1rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.rp-metrica-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:0.6rem; }
.rp-metrica-icon svg { width:18px; height:18px; }
.rp-metrica-icon.blue   { background:#eff6ff; color:#1a56db; }
.rp-metrica-icon.green  { background:#f0fdf4; color:#16a34a; }
.rp-metrica-icon.teal   { background:#f0fdfa; color:#0d9488; }
.rp-metrica-label { font-size:0.75rem; color:#6b7280; font-weight:500; margin-bottom:3px; }
.rp-metrica-valor { font-size:1.4rem; font-weight:700; color:#0f172a; margin-bottom:3px; }
.rp-metrica-trend { font-size:0.72rem; font-weight:500; color:#6b7280; }

.rp-graficas-grid { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem; }
.rp-grafica-card { background:#fff; border-radius:12px; padding:1rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); overflow:hidden; }
.rp-grafica-card h3 { font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:0.75rem; }

.rp-tabla-card { background:#fff; border-radius:12px; padding:1rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.rp-tabla-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; }
.rp-tabla-header h3 { font-size:0.9rem; font-weight:700; color:#0f172a; }
.rp-tabla-wrap { overflow-x:auto; }
.rp-tabla { width:100%; border-collapse:collapse; font-size:0.8rem; }
.rp-tabla thead th { text-align:left; padding:0.5rem 0.6rem; color:#6b7280; font-weight:600; font-size:0.75rem; border-bottom:1px solid #f1f5f9; white-space:nowrap; }
.rp-tabla tbody tr { border-bottom:1px solid #f8fafc; transition:background 0.15s; }
.rp-tabla tbody tr:hover { background:#f8fafc; }
.rp-tabla tbody td { padding:0.65rem 0.6rem; color:#374151; vertical-align:middle; }
.rp-gen-cell { display:flex; align-items:center; gap:6px; }
.rp-gen-avatar { width:24px; height:24px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:0.6rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.rp-estado { padding:3px 8px; border-radius:999px; font-size:0.72rem; font-weight:600; }
.rp-estado.completado { background:#f0fdf4; color:#16a34a; }
.rp-estado.en-proceso { background:#fff7ed; color:#d97706; }
.rp-estado.error      { background:#fef2f2; color:#dc2626; }
.rp-formato.pdf   { color:#dc2626; font-weight:600; font-size:0.78rem; }
.rp-formato.excel { color:#16a34a; font-weight:600; font-size:0.78rem; }
.rp-btn-descargar { width:28px; height:28px; border-radius:7px; background:#eff6ff; color:#1a56db; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.15s; }
.rp-btn-descargar:hover { background:#dbeafe; }
.rp-btn-descargar:disabled { opacity:0.4; cursor:not-allowed; }

.rp-aside-card { background:#fff; border-radius:12px; padding:1rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.rp-aside-card h4 { font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:0.75rem; }
.rp-acciones-lista { display:flex; flex-direction:column; gap:0.15rem; }
.rp-accion { display:flex; align-items:center; gap:8px; padding:0.55rem 0.4rem; border-radius:8px; font-size:0.78rem; font-weight:500; color:#374151; background:none; border:none; cursor:pointer; font-family:inherit; transition:background 0.15s; width:100%; text-align:left; }
.rp-accion:hover { background:#f8fafc; color:#1a56db; }
`;

export default function Reportes() {
  const { token, usuario }  = useAuth();
  const canvasBarras        = useRef(null);
  const canvasLinea         = useRef(null);
  const [reportes, setReportes]           = useState(REPORTES_INICIALES);
  const [alerta, setAlerta]               = useState(null);
  const [exportarAbierto, setExportarAbierto] = useState(false);
  const [filtros, setFiltros]             = useState({ fecha: "", estado: "", especialidad: "", modalidad: "" });

  useEffect(() => {
    if (document.getElementById("rp-styles")) return;
    const tag = document.createElement("style");
    tag.id = "rp-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  // Dibujar gráficas con Canvas
  useEffect(() => {
    renderBarras();
    renderLinea();
    const handler = () => { renderBarras(); renderLinea(); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const renderBarras = () => {
    const canvas = canvasBarras.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const datos  = [260, 198, 156, 142, 130, 94, 82, 55];
    const labels = ["Med. Gral", "Dermat.", "Cardiol.", "Ortoped.", "Ginecol.", "Pediatr.", "Neurol.", "Otras"];
    const max    = Math.max(...datos);
    canvas.width  = canvas.parentElement.offsetWidth || 300;
    canvas.height = 180;
    const w = canvas.width, h = canvas.height, pL = 30, pR = 10, pT = 16, pB = 40;
    const barW = (w - pL - pR) / datos.length - 6;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pT + ((h - pT - pB) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(w - pR, y); ctx.stroke();
      ctx.fillStyle = "#9ca3af"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
      ctx.fillText(Math.round(max - (max / 4) * i), pL - 3, y + 3);
    }
    datos.forEach((val, i) => {
      const x    = pL + i * ((w - pL - pR) / datos.length) + 3;
      const barH = ((h - pT - pB) * val) / max;
      const y    = h - pB - barH;
      ctx.fillStyle = "#1a56db"; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, [3,3,0,0]);
      else ctx.rect(x, y, barW, barH);
      ctx.fill();
      ctx.fillStyle = "#374151"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(val, x + barW / 2, y - 3);
      ctx.fillStyle = "#6b7280"; ctx.font = "8px sans-serif";
      ctx.fillText(labels[i], x + barW / 2, h - pB + 12);
    });
  };

  const renderLinea = () => {
    const canvas = canvasLinea.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    const datos  = [180, 196, 210, 185, 210, 150, 117];
    const labels = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    const max    = Math.max(...datos) + 30;
    canvas.width  = canvas.parentElement.offsetWidth || 300;
    canvas.height = 180;
    const w = canvas.width, h = canvas.height, pL = 30, pR = 10, pT = 16, pB = 30;
    const stepX = (w - pL - pR) / (datos.length - 1);
    const getY  = v => pT + ((h - pT - pB) * (1 - v / max));
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#f1f5f9"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pT + ((h - pT - pB) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(w - pR, y); ctx.stroke();
      ctx.fillStyle = "#9ca3af"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
      ctx.fillText(Math.round(max - (max / 4) * i), pL - 3, y + 3);
    }
    ctx.beginPath();
    datos.forEach((val, i) => { const x = pL + i * stepX, y = getY(val); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.lineTo(pL + (datos.length - 1) * stepX, h - pB); ctx.lineTo(pL, h - pB); ctx.closePath();
    const grad = ctx.createLinearGradient(0, pT, 0, h - pB);
    grad.addColorStop(0, "rgba(26,86,219,0.15)"); grad.addColorStop(1, "rgba(26,86,219,0)");
    ctx.fillStyle = grad; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = "#1a56db"; ctx.lineWidth = 2; ctx.lineJoin = "round";
    datos.forEach((val, i) => { const x = pL + i * stepX, y = getY(val); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();
    datos.forEach((val, i) => {
      const x = pL + i * stepX, y = getY(val);
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff"; ctx.strokeStyle = "#1a56db"; ctx.lineWidth = 2; ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#374151"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(val, x, y - 7);
      ctx.fillStyle = "#6b7280"; ctx.fillText(labels[i], x, h - pB + 13);
    });
  };

  const generarReporte = async () => {
    try {
      const res   = await fetch(`${API}/citas`, { headers: { Authorization: `Bearer ${token}` } });
      const citas = await res.json();
      if (!res.ok) { mostrarAlerta("error", "Error", "No se pudieron obtener los datos."); return; }
      const nuevo = {
        fecha:        new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }),
        tipo:         "Reporte de citas",
        rango:        "Todas las fechas",
        generadoPor:  usuario?.nombre || "Admin",
        iniciales:    `${usuario?.nombre?.[0] || "A"}${usuario?.apellido?.[0] || ""}`.toUpperCase(),
        estado:       "completado",
        formato:      "pdf",
      };
      setReportes(prev => [nuevo, ...prev]);
      mostrarAlerta("success", "Reporte generado", `Se encontraron ${citas.length} citas en el sistema.`);
    } catch {
      mostrarAlerta("error", "Error de conexión", "No se pudo conectar con el servidor.");
    }
  };

  const exportar = (formato) => {
    setExportarAbierto(false);
    mostrarAlerta("success", `Exportando en ${formato.toUpperCase()}`, "La descarga iniciará en breve.");
  };

  const descargar = (idx) => {
    if (reportes[idx].estado !== "completado") { mostrarAlerta("error", "No disponible", "Este reporte aún no está listo."); return; }
    mostrarAlerta("success", "Descarga iniciada", `Descargando "${reportes[idx].tipo}" en ${reportes[idx].formato.toUpperCase()}.`);
  };

  const mostrarAlerta = (tipo, titulo, mensaje) => {
    setAlerta({ tipo, titulo, mensaje });
    setTimeout(() => setAlerta(null), 4000);
  };

  const ESTADO_LABELS = { completado: "Completado", "en-proceso": "En proceso", error: "Error" };

  return (
    <Layout>
      <div className="rp-page-header">
        <h1>Reportes administrativos</h1>
        <p>Genera, consulta y exporta reportes de citas, usuarios y actividad del sistema.</p>
      </div>

      {alerta && (
        <div className={`rp-alerta rp-alerta-${alerta.tipo}`}>
          <div className="rp-alerta-icono">
            {alerta.tipo === "success" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>}
            {alerta.tipo === "info"    && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            {alerta.tipo === "error"   && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
          </div>
          <div className="rp-alerta-texto"><strong>{alerta.titulo}</strong><span>{alerta.mensaje}</span></div>
        </div>
      )}

      {/* FILTROS */}
      <div className="rp-filtros-card">
        <div className="rp-filtros-row">
          {[
            { key: "fecha",        label: "Rango de fechas",   opts: [["","Todos los rangos"],["may2026","May 2026"],["abr2026","Abr 2026"]] },
            { key: "estado",       label: "Estado",             opts: [["","Todos"],["confirmada","Confirmada"],["pendiente","Pendiente"],["cancelada","Cancelada"],["completada","Completada"]] },
            { key: "especialidad", label: "Especialidad",       opts: [["","Todas"],["medicina-general","Medicina general"],["cardiologia","Cardiología"],["dermatologia","Dermatología"]] },
            { key: "modalidad",    label: "Modalidad",          opts: [["","Todas"],["presencial","Presencial"],["virtual","Virtual"]] },
          ].map(({ key, label, opts }) => (
            <div className="rp-filtro-item" key={key}>
              <label>{label}</label>
              <div className="rp-filtro-select">
                <select value={filtros[key]} onChange={e => setFiltros(p => ({ ...p, [key]: e.target.value }))}>
                  {opts.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="rp-filtros-btns">
          <button className="rp-btn-limpiar" onClick={() => setFiltros({ fecha:"", estado:"", especialidad:"", modalidad:"" })}>Limpiar filtros</button>
          <button className="rp-btn-generar" onClick={generarReporte}>Generar reporte</button>
          <div className="rp-btn-exportar-wrap">
            <button className="rp-btn-exportar" onClick={() => setExportarAbierto(p => !p)}>
              Exportar
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {exportarAbierto && (
              <div className="rp-exportar-dropdown">
                <button onClick={() => exportar("pdf")}>Exportar PDF</button>
                <button onClick={() => exportar("excel")}>Exportar Excel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rp-content-grid">
        <div className="rp-main-col">
          {/* MÉTRICAS */}
          <div className="rp-metricas-grid">
            {[
              { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, color: "blue",  label: "Citas programadas", valor: "—",  trend: "Sistema activo" },
              { icon: <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,                                                                       color: "green", label: "Médicos activos",   valor: "7",  trend: "En el sistema"  },
              { icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>,                                                                                                                                                  color: "teal",  label: "Especialidades",   valor: "8",  trend: "Disponibles"    },
            ].map(({ icon, color, label, valor, trend }) => (
              <div className="rp-metrica-card" key={label}>
                <div className={`rp-metrica-icon ${color}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                </div>
                <p className="rp-metrica-label">{label}</p>
                <p className="rp-metrica-valor">{valor}</p>
                <p className="rp-metrica-trend">{trend}</p>
              </div>
            ))}
          </div>

          {/* GRÁFICAS */}
          <div className="rp-graficas-grid">
            <div className="rp-grafica-card">
              <h3>Citas por especialidad</h3>
              <div className="barras-wrap"><canvas ref={canvasBarras} /></div>
            </div>
            <div className="rp-grafica-card">
              <h3>Actividad semanal</h3>
              <div className="barras-wrap"><canvas ref={canvasLinea} /></div>
            </div>
          </div>

          {/* TABLA */}
          <div className="rp-tabla-card">
            <div className="rp-tabla-header"><h3>Reportes generados</h3></div>
            <div className="rp-tabla-wrap">
              <table className="rp-tabla">
                <thead>
                  <tr>
                    <th>Fecha</th><th>Tipo</th><th>Rango</th>
                    <th>Generado por</th><th>Estado</th><th>Formato</th><th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: "0.78rem" }}>{r.fecha}</td>
                      <td style={{ fontWeight: 500 }}>{r.tipo}</td>
                      <td style={{ fontSize: "0.78rem", color: "#6b7280" }}>{r.rango}</td>
                      <td>
                        <div className="rp-gen-cell">
                          <div className="rp-gen-avatar">{r.iniciales}</div>
                          {r.generadoPor}
                        </div>
                      </td>
                      <td><span className={`rp-estado ${r.estado}`}>{ESTADO_LABELS[r.estado]}</span></td>
                      <td><span className={`rp-formato ${r.formato}`}>{r.formato.toUpperCase()}</span></td>
                      <td>
                        <button className="rp-btn-descargar" disabled={r.estado !== "completado"} onClick={() => descargar(i)} title="Descargar">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ASIDE */}
        <div className="rp-aside-col">
          <div className="rp-aside-card">
            <h4>Acciones rápidas</h4>
            <div className="rp-acciones-lista">
              <button className="rp-accion" onClick={() => mostrarAlerta("success", "Reporte programado", "Tu reporte automático ha sido programado.")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Programar automático
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="rp-accion" onClick={() => mostrarAlerta("info", "Próximamente", "Esta funcionalidad estará disponible pronto.")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Reporte personalizado
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <button className="rp-accion" onClick={() => mostrarAlerta("info", "Diccionario", "El diccionario de datos estará disponible pronto.")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Ver diccionario
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" style={{ marginLeft: "auto" }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}