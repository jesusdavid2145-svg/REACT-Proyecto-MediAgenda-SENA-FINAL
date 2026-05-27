import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const API = "http://localhost:3000/api";

const styles = `
.aj-page-header { margin-bottom:1.25rem; }
.aj-page-header h1 { font-size:1.5rem; font-weight:700; color:#0f172a; margin-bottom:0.25rem; }
.aj-page-header p  { font-size:0.875rem; color:#6b7280; }

.aj-alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1rem; line-height:1.5; }
.aj-alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.aj-alerta-texto strong { display:block; font-size:0.9rem; font-weight:600; margin-bottom:2px; }
.aj-alerta-texto span { font-size:0.82rem; }
.aj-alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.aj-alerta-success .aj-alerta-icono { background:#16a34a; }
.aj-alerta-success .aj-alerta-texto strong { color:#15803d; }
.aj-alerta-success .aj-alerta-texto span { color:#166534; }
.aj-alerta-error { background:#fef2f2; border:1px solid #fecaca; }
.aj-alerta-error .aj-alerta-icono { background:#ef4444; }
.aj-alerta-error .aj-alerta-texto strong { color:#b91c1c; }
.aj-alerta-error .aj-alerta-texto span { color:#991b1b; }
.aj-alerta-warning { background:#fff7ed; border:1px solid #fed7aa; }
.aj-alerta-warning .aj-alerta-icono { background:#fb923c; }
.aj-alerta-warning .aj-alerta-texto strong { color:#c2410c; }
.aj-alerta-warning .aj-alerta-texto span { color:#9a3412; }

.aj-grid { display:grid; grid-template-columns:1fr 240px; gap:1.5rem; align-items:start; }
.aj-main-col { display:flex; flex-direction:column; gap:1.25rem; }

.aj-seccion { background:#fff; border-radius:16px; padding:1.5rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); }
.aj-seccion-header { display:flex; align-items:flex-start; gap:12px; margin-bottom:1.25rem; padding-bottom:1rem; border-bottom:1px solid #f1f5f9; }
.aj-seccion-icon { width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.aj-seccion-icon.blue   { background:#eff6ff; color:#1a56db; }
.aj-seccion-icon.green  { background:#f0fdf4; color:#16a34a; }
.aj-seccion-icon.orange { background:#fff7ed; color:#fb923c; }
.aj-seccion-icon.red    { background:#fef2f2; color:#dc2626; }
.aj-seccion-header h3 { font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:2px; }
.aj-seccion-header p  { font-size:0.82rem; color:#6b7280; }
.aj-seccion-footer { display:flex; justify-content:flex-end; margin-top:1.25rem; padding-top:1rem; border-top:1px solid #f1f5f9; }

.aj-avatar-section { display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem; padding:1rem; background:#f8fafc; border-radius:12px; }
.aj-avatar-grande { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:1.3rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.aj-avatar-nombre { font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:2px; }
.aj-avatar-rol    { font-size:0.82rem; color:#6b7280; }

.aj-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
.aj-field { display:flex; flex-direction:column; gap:6px; }
.aj-field label { font-size:0.82rem; font-weight:600; color:#374151; }
.aj-input-wrap { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; background:#fafbff; transition:border-color 0.15s,box-shadow 0.15s; }
.aj-input-wrap:focus-within { border-color:#1a56db; box-shadow:0 0 0 3px rgba(26,86,219,0.1); background:#fff; }
.aj-input-wrap.error { border-color:#ef4444; background:#fff5f5; }
.aj-input-wrap svg { width:16px; height:16px; color:#9ca3af; flex-shrink:0; }
.aj-input-wrap input { flex:1; border:none; background:transparent; padding:10px 8px; font-size:0.875rem; color:#1e293b; outline:none; font-family:inherit; }
.aj-input-wrap input::placeholder { color:#c4c9d4; }
.aj-eye-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; color:#9ca3af; padding:0; }

.aj-fortaleza { display:flex; align-items:center; gap:8px; margin-top:6px; }
.aj-fortaleza-barras { display:flex; gap:4px; flex:1; }
.aj-barra { height:4px; flex:1; border-radius:999px; background:#e2e8f0; transition:background 0.3s; }
.aj-fortaleza-label { font-size:0.75rem; font-weight:600; white-space:nowrap; }

.aj-toggle-lista { display:flex; flex-direction:column; }
.aj-toggle-item { display:flex; align-items:center; justify-content:space-between; padding:1rem 0; border-bottom:1px solid #f8fafc; gap:1rem; }
.aj-toggle-item:last-child { border-bottom:none; }
.aj-toggle-titulo { font-size:0.875rem; font-weight:600; color:#1e293b; margin-bottom:2px; }
.aj-toggle-sub    { font-size:0.78rem; color:#6b7280; }
.aj-toggle-switch { position:relative; display:inline-block; width:44px; height:24px; flex-shrink:0; }
.aj-toggle-switch input { opacity:0; width:0; height:0; }
.aj-slider { position:absolute; cursor:pointer; inset:0; background:#e2e8f0; border-radius:999px; transition:background 0.2s; }
.aj-slider::before { content:''; position:absolute; width:18px; height:18px; left:3px; top:3px; background:#fff; border-radius:50%; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
.aj-toggle-switch input:checked + .aj-slider { background:#1a56db; }
.aj-toggle-switch input:checked + .aj-slider::before { transform:translateX(20px); }

.aj-peligro-lista { display:flex; flex-direction:column; }
.aj-peligro-item { display:flex; align-items:center; justify-content:space-between; padding:1rem 0; border-bottom:1px solid #fef2f2; gap:1rem; }
.aj-peligro-item:last-child { border-bottom:none; }
.aj-peligro-titulo { font-size:0.875rem; font-weight:600; color:#dc2626; margin-bottom:2px; }
.aj-peligro-desc   { font-size:0.78rem; color:#6b7280; }
.aj-btn-peligro { padding:8px 16px; background:#ef4444; color:#fff; font-size:0.82rem; font-weight:600; border:none; border-radius:8px; cursor:pointer; font-family:inherit; transition:background 0.15s; white-space:nowrap; flex-shrink:0; }
.aj-btn-peligro:hover { background:#dc2626; }
.aj-btn-peligro-sec { padding:8px 16px; background:transparent; color:#dc2626; font-size:0.82rem; font-weight:600; border:1.5px solid #fecaca; border-radius:8px; cursor:pointer; font-family:inherit; transition:background 0.15s; white-space:nowrap; flex-shrink:0; }
.aj-btn-peligro-sec:hover { background:#fef2f2; }

.aj-btn-guardar { display:flex; align-items:center; gap:6px; padding:10px 20px; background:#1a56db; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s; }
.aj-btn-guardar:hover { background:#1648c0; }

.aj-aside-col { display:flex; flex-direction:column; gap:1rem; position:sticky; top:80px; }
.aj-aside-card { background:#fff; border-radius:14px; padding:1.25rem; border:1px solid #e8efff; box-shadow:0 2px 8px rgba(26,86,219,0.06); text-align:center; }
.aj-aside-avatar { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:1.2rem; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 0.75rem; }
.aj-aside-nombre { font-size:1rem; font-weight:700; color:#0f172a; margin-bottom:2px; }
.aj-aside-rol    { font-size:0.78rem; color:#1a56db; font-weight:600; margin-bottom:4px; }
.aj-aside-correo { font-size:0.78rem; color:#6b7280; }
.aj-aside-divider { height:1px; background:#f1f5f9; margin:0.75rem 0; }

.modal-overlay { display:none; position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:999; align-items:center; justify-content:center; }
.modal-overlay.active { display:flex; }
.modal-box-small { background:#fff; border-radius:20px; padding:2rem; width:90%; max-width:420px; text-align:center; box-shadow:0 8px 40px rgba(0,0,0,0.15); }
.modal-icono-error { width:68px; height:68px; border-radius:50%; background:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
.modal-icono-warning { width:68px; height:68px; border-radius:50%; background:#fb923c; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
.modal-box-small h3 { font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem; }
.modal-box-small p  { font-size:0.875rem; color:#6b7280; line-height:1.6; margin-bottom:0.75rem; }
.modal-input-wrap { margin-bottom:1.25rem; }
.modal-input-wrap input { width:100%; border:1.5px solid #e2e8f0; border-radius:10px; padding:10px 14px; font-size:0.875rem; color:#1e293b; font-family:inherit; outline:none; text-align:center; letter-spacing:0.05em; transition:border-color 0.15s; }
.modal-input-wrap input:focus { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
.modal-btns-row { display:flex; gap:0.75rem; justify-content:center; }
.btn-modal-secundario { padding:9px 20px; background:transparent; color:#6b7280; font-size:0.875rem; font-weight:600; border:1.5px solid #e2e8f0; border-radius:10px; cursor:pointer; font-family:inherit; }
.btn-modal-secundario:hover { background:#f8fafc; }
.btn-modal-danger { padding:9px 20px; background:#ef4444; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; transition:background 0.15s,opacity 0.15s; }
.btn-modal-danger:hover { background:#dc2626; }
.btn-modal-danger:disabled { opacity:0.4; cursor:not-allowed; }
.btn-modal-warning { padding:9px 20px; background:#fb923c; color:#fff; font-size:0.875rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; font-family:inherit; }
.btn-modal-warning:hover { background:#f97316; }
`;

export default function Ajustes() {
  const navigate    = useNavigate();
  const { token, usuario, nombreCompleto, iniciales, actualizarUsuario, logout } = useAuth();

  const [form, setForm] = useState({
    nombres:   usuario?.nombre   || "",
    apellidos: usuario?.apellido || "",
    correo:    usuario?.correo   || "",
    telefono:  usuario?.telefono || "",
  });
  const [passes, setPasses] = useState({ actual: "", nueva: "", confirmar: "" });
  const [mostrarPass, setMostrarPass] = useState({ actual: false, nueva: false, confirmar: false });
  const [fortaleza, setFortaleza]     = useState(0);
  const [alerta, setAlerta]           = useState(null);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalDesactivar, setModalDesactivar] = useState(false);
  const [confirmarEliminar, setConfirmarEliminar] = useState("");
  const [prefs, setPrefs] = useState({ recordatorios: true, notifCitas: true, newsletter: false });

  useEffect(() => {
    if (document.getElementById("aj-styles")) return;
    const tag = document.createElement("style");
    tag.id = "aj-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  const evalFortaleza = (pass) => {
    let pts = 0;
    if (pass.length >= 8)          pts++;
    if (/[A-Z]/.test(pass))        pts++;
    if (/[0-9]/.test(pass))        pts++;
    if (/[^A-Za-z0-9]/.test(pass)) pts++;
    setFortaleza(pts);
  };

  const guardarPerfil = () => {
    if (!form.nombres || !form.apellidos) { mostrarAlerta("error", "Campos requeridos", "Nombres y apellidos son obligatorios."); return; }
    if (!form.correo?.includes("@"))      { mostrarAlerta("error", "Correo inválido",   "Ingresa un correo electrónico válido.");   return; }
    actualizarUsuario({ nombre: form.nombres, apellido: form.apellidos, correo: form.correo, telefono: form.telefono });
    mostrarAlerta("success", "¡Cambios guardados!", "Tu información personal fue actualizada correctamente.");
  };

  const cambiarContrasena = async () => {
    if (!passes.actual)            { mostrarAlerta("error", "Campo requerido",    "Ingresa tu contraseña actual.");                    return; }
    if (passes.nueva.length < 8)   { mostrarAlerta("error", "Contraseña corta",   "La nueva contraseña debe tener al menos 8 caracteres."); return; }
    if (passes.nueva !== passes.confirmar) { mostrarAlerta("error", "No coinciden", "Las contraseñas no coinciden."); return; }
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: usuario?.correo, contrasena: passes.actual }),
      });
      if (!res.ok) { mostrarAlerta("error", "Contraseña incorrecta", "La contraseña actual no es correcta."); return; }
      mostrarAlerta("success", "¡Contraseña actualizada!", "Tu contraseña fue cambiada correctamente.");
      setPasses({ actual: "", nueva: "", confirmar: "" });
      setFortaleza(0);
    } catch { mostrarAlerta("error", "Error de conexión", "No se pudo conectar con el servidor."); }
  };

  const confirmarEliminarCuenta = () => {
    if (confirmarEliminar !== "ELIMINAR") return;
    setModalEliminar(false);
    logout();
    navigate("/login");
  };

  const mostrarAlerta = (tipo, titulo, mensaje) => {
    setAlerta({ tipo, titulo, mensaje });
    setTimeout(() => setAlerta(null), 4000);
  };

  const rolLabel = usuario?.rol === "administrador" ? "Administrador" : usuario?.rol === "medico" ? "Médico" : "Paciente";

  const FORTALEZA_NIVELES = [
    { color: "#ef4444", texto: "Muy débil" },
    { color: "#fb923c", texto: "Débil"     },
    { color: "#eab308", texto: "Regular"   },
    { color: "#16a34a", texto: "Fuerte"    },
  ];
  const nivelF = FORTALEZA_NIVELES[fortaleza - 1];

  return (
    <Layout>
      <div className="aj-page-header">
        <h1>Ajustes de cuenta</h1>
        <p>Administra tu perfil, seguridad y preferencias de la aplicación.</p>
      </div>

      {alerta && (
        <div className={`aj-alerta aj-alerta-${alerta.tipo}`}>
          <div className="aj-alerta-icono">
            {alerta.tipo === "success" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>}
            {alerta.tipo === "error"   && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
            {alerta.tipo === "warning" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>}
          </div>
          <div className="aj-alerta-texto"><strong>{alerta.titulo}</strong><span>{alerta.mensaje}</span></div>
        </div>
      )}

      <div className="aj-grid">
        <div className="aj-main-col">

          {/* ── INFORMACIÓN PERSONAL ── */}
          <div className="aj-seccion">
            <div className="aj-seccion-header">
              <div className="aj-seccion-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div><h3>Información personal</h3><p>Actualiza tus datos personales y de contacto.</p></div>
            </div>

            <div className="aj-avatar-section">
              <div className="aj-avatar-grande">{iniciales}</div>
              <div>
                <p className="aj-avatar-nombre">{nombreCompleto}</p>
                <p className="aj-avatar-rol">{rolLabel}</p>
              </div>
            </div>

            <div className="aj-form-grid">
              {[
                { key: "nombres",   label: "Nombres",              placeholder: "Tu nombre",    icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
                { key: "apellidos", label: "Apellidos",            placeholder: "Tus apellidos", icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
                { key: "correo",    label: "Correo electrónico",   placeholder: "tu@correo.com", icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></> },
                { key: "telefono",  label: "Número telefónico",    placeholder: "300 000 0000",  icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.42 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6.29 6.29l1.32-1.22a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/> },
              ].map(({ key, label, placeholder, icon }) => (
                <div className="aj-field" key={key}>
                  <label>{label}</label>
                  <div className="aj-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>
                    <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                </div>
              ))}
            </div>

            <div className="aj-seccion-footer">
              <button className="aj-btn-guardar" onClick={guardarPerfil}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                Guardar cambios
              </button>
            </div>
          </div>

          {/* ── SEGURIDAD ── */}
          <div className="aj-seccion">
            <div className="aj-seccion-header">
              <div className="aj-seccion-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div><h3>Seguridad</h3><p>Actualiza tu contraseña para mantener tu cuenta segura.</p></div>
            </div>

            <div className="aj-form-grid">
              {[
                { key: "actual",    label: "Contraseña actual",    placeholder: "Contraseña actual"    },
                { key: "nueva",     label: "Nueva contraseña",     placeholder: "Nueva contraseña"     },
                { key: "confirmar", label: "Confirmar contraseña", placeholder: "Confirma tu contraseña" },
              ].map(({ key, label, placeholder }) => (
                <div className="aj-field" key={key}>
                  <label>{label}</label>
                  <div className="aj-input-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input
                      type={mostrarPass[key] ? "text" : "password"}
                      value={passes[key]}
                      placeholder={placeholder}
                      onChange={e => {
                        setPasses(p => ({ ...p, [key]: e.target.value }));
                        if (key === "nueva") evalFortaleza(e.target.value);
                      }}
                    />
                    <button className="aj-eye-btn" onClick={() => setMostrarPass(p => ({ ...p, [key]: !p[key] }))}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  {key === "nueva" && passes.nueva && (
                    <div className="aj-fortaleza">
                      <div className="aj-fortaleza-barras">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="aj-barra" style={{ background: i <= fortaleza ? nivelF?.color : "#e2e8f0" }} />
                        ))}
                      </div>
                      {nivelF && <span className="aj-fortaleza-label" style={{ color: nivelF.color }}>{nivelF.texto}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="aj-seccion-footer">
              <button className="aj-btn-guardar" onClick={cambiarContrasena}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Actualizar contraseña
              </button>
            </div>
          </div>

          {/* ── NOTIFICACIONES ── */}
          <div className="aj-seccion">
            <div className="aj-seccion-header">
              <div className="aj-seccion-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div><h3>Preferencias de notificaciones</h3><p>Controla qué notificaciones deseas recibir.</p></div>
            </div>
            <div className="aj-toggle-lista">
              {[
                { key: "recordatorios", titulo: "Recordatorios de citas",   sub: "Recibe recordatorios antes de tus citas programadas." },
                { key: "notifCitas",    titulo: "Notificaciones de citas",  sub: "Confirmaciones, cancelaciones y cambios de citas."     },
                { key: "newsletter",    titulo: "Boletín informativo",      sub: "Recibe noticias y actualizaciones de MediAgenda."       },
              ].map(({ key, titulo, sub }) => (
                <div className="aj-toggle-item" key={key}>
                  <div><p className="aj-toggle-titulo">{titulo}</p><p className="aj-toggle-sub">{sub}</p></div>
                  <label className="aj-toggle-switch">
                    <input type="checkbox" checked={prefs[key]} onChange={e => setPrefs(p => ({ ...p, [key]: e.target.checked }))} />
                    <span className="aj-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ── ZONA DE PELIGRO ── */}
          <div className="aj-seccion" style={{ borderColor: "#fecaca" }}>
            <div className="aj-seccion-header">
              <div className="aj-seccion-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div><h3>Zona de peligro</h3><p>Acciones irreversibles sobre tu cuenta.</p></div>
            </div>
            <div className="aj-peligro-lista">
              <div className="aj-peligro-item">
                <div>
                  <p className="aj-peligro-titulo">Desactivar cuenta</p>
                  <p className="aj-peligro-desc">Tu cuenta quedará inactiva temporalmente. Podrás reactivarla iniciando sesión.</p>
                </div>
                <button className="aj-btn-peligro-sec" onClick={() => setModalDesactivar(true)}>Desactivar</button>
              </div>
              <div className="aj-peligro-item">
                <div>
                  <p className="aj-peligro-titulo">Eliminar cuenta</p>
                  <p className="aj-peligro-desc">Esta acción es permanente e irreversible. Se eliminarán todos tus datos.</p>
                </div>
                <button className="aj-btn-peligro" onClick={() => { setConfirmarEliminar(""); setModalEliminar(true); }}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── ASIDE ── */}
        <div className="aj-aside-col">
          <div className="aj-aside-card">
            <div className="aj-aside-avatar">{iniciales}</div>
            <p className="aj-aside-nombre">{nombreCompleto}</p>
            <p className="aj-aside-rol">{rolLabel}</p>
            <p className="aj-aside-correo">{usuario?.correo}</p>
            <div className="aj-aside-divider" />
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", textAlign: "left" }}>
              Miembro desde 2025
            </p>
          </div>
        </div>
      </div>

      {/* MODAL DESACTIVAR */}
      <div className={`modal-overlay${modalDesactivar ? " active" : ""}`} onClick={e => { if (e.target === e.currentTarget) setModalDesactivar(false); }}>
        <div className="modal-box-small">
          <div className="modal-icono-warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="28" height="28"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          </div>
          <h3>¿Desactivar tu cuenta?</h3>
          <p>Tu cuenta quedará inactiva temporalmente. Podrás reactivarla iniciando sesión de nuevo.</p>
          <div className="modal-btns-row">
            <button className="btn-modal-secundario" onClick={() => setModalDesactivar(false)}>Cancelar</button>
            <button className="btn-modal-warning" onClick={() => { setModalDesactivar(false); mostrarAlerta("warning", "Cuenta desactivada", "Tu cuenta ha sido desactivada temporalmente."); }}>Desactivar</button>
          </div>
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      <div className={`modal-overlay${modalEliminar ? " active" : ""}`} onClick={e => { if (e.target === e.currentTarget) setModalEliminar(false); }}>
        <div className="modal-box-small">
          <div className="modal-icono-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h3>¿Eliminar tu cuenta?</h3>
          <p>Esta acción es permanente e irreversible. Se eliminarán todos tus datos.</p>
          <p style={{ fontSize: "0.82rem", color: "#374151", marginBottom: "0.75rem" }}>Escribe <strong>ELIMINAR</strong> para confirmar:</p>
          <div className="modal-input-wrap">
            <input value={confirmarEliminar} onChange={e => setConfirmarEliminar(e.target.value)} placeholder="ELIMINAR" />
          </div>
          <div className="modal-btns-row">
            <button className="btn-modal-secundario" onClick={() => setModalEliminar(false)}>Cancelar</button>
            <button className="btn-modal-danger" disabled={confirmarEliminar !== "ELIMINAR"} onClick={confirmarEliminarCuenta}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}