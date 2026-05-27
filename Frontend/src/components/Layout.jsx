import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:3000/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Plus Jakarta Sans',sans-serif; background:#f0f5ff; min-height:100vh; display:flex; flex-direction:column; }

/* ── HEADER ── */
.app-header {
  background:#1a56db; height:64px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 1.5rem; position:sticky; top:0; z-index:100; gap:1rem;
}
.header-logo { display:flex; align-items:center; gap:10px; font-weight:700; font-size:1.1rem; color:#fff; text-decoration:none; white-space:nowrap; cursor:pointer; }
.header-logo svg { width:32px; height:32px; }
.header-search { flex:1; max-width:480px; display:flex; align-items:center; gap:8px; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); border-radius:10px; padding:0 14px; }
.header-search svg { width:16px; height:16px; color:rgba(255,255,255,0.7); flex-shrink:0; }
.header-search input { flex:1; border:none; background:transparent; padding:10px 0; font-size:0.875rem; color:#fff; outline:none; font-family:inherit; }
.header-search input::placeholder { color:rgba(255,255,255,0.6); }
.header-right { display:flex; align-items:center; gap:0.75rem; }

/* ── NOTIFICACIONES ── */
.notif-wrap { position:relative; cursor:pointer; }
.notif-btn { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.25); border-radius:50%; width:42px; height:42px; display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:background 0.15s; }
.notif-btn:hover { background:rgba(255,255,255,0.25); }
.notif-btn svg { width:20px; height:20px; color:#fff; }
.notif-badge { position:absolute; top:-4px; right:-4px; background:#ef4444; color:#fff; font-size:0.65rem; font-weight:700; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-family:inherit; border:2px solid #1a56db; }
.notif-dropdown { display:none; position:absolute; top:calc(100% + 12px); right:0; width:320px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.12); border:1px solid #e2e8f4; z-index:200; overflow:hidden; }
.notif-dropdown.active { display:block; }
.notif-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem 0.75rem; border-bottom:1px solid #f1f5f9; }
.notif-header span { font-size:0.95rem; font-weight:700; color:#0f172a; }
.notif-header button { font-size:0.75rem; color:#1a56db; background:none; border:none; cursor:pointer; font-family:inherit; font-weight:500; }
.notif-footer { padding:0.75rem 1.25rem; text-align:center; }
.notif-footer a { font-size:0.82rem; color:#1a56db; text-decoration:none; font-weight:500; }
.notif-footer a:hover { text-decoration:underline; }

/* ── PERFIL ── */
.profile-wrap { position:relative; cursor:pointer; }
.profile-avatar { width:42px; height:42px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:0.85rem; font-weight:700; display:flex; align-items:center; justify-content:center; border:2px solid rgba(255,255,255,0.4); transition:transform 0.2s,box-shadow 0.2s; user-select:none; }
.profile-wrap:hover .profile-avatar { transform:scale(1.08); box-shadow:0 0 0 4px rgba(255,255,255,0.2); }
.profile-dropdown { display:none; position:absolute; top:calc(100% + 12px); right:0; width:240px; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.14); border:1px solid #e2e8f4; z-index:200; overflow:hidden; }
.profile-wrap:hover .profile-dropdown { display:block; }
.profile-info { display:flex; align-items:center; gap:10px; padding:1rem 1.25rem; }
.profile-avatar-lg { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,#54a0ff,#2e86de); color:#fff; font-size:0.9rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.profile-nombre { font-size:0.9rem; font-weight:700; color:#0f172a; }
.profile-rol { font-size:0.78rem; color:#6b7280; margin-top:1px; }
.profile-divider { height:1px; background:#f1f5f9; margin:0.25rem 0; }
.profile-option { display:flex; align-items:center; gap:10px; padding:0.7rem 1.25rem; font-size:0.875rem; color:#374151; text-decoration:none; transition:background 0.15s; font-weight:500; cursor:pointer; background:none; border:none; width:100%; font-family:inherit; }
.profile-option:hover { background:#f8fafc; color:#1a56db; }
.profile-option.danger { color:#ef4444; }
.profile-option.danger:hover { background:#fef2f2; color:#dc2626; }
.profile-option svg { width:16px; height:16px; flex-shrink:0; }

/* ── LAYOUT ── */
.app-layout { display:flex; flex:1; }

/* ── SIDEBAR ── */
.app-aside { width:230px; background:#fff; border-right:1px solid #e2e8f4; min-height:calc(100vh - 64px - 52px); display:flex; flex-direction:column; justify-content:space-between; padding:1.25rem 0.75rem; flex-shrink:0; }
.sidebar-nav { display:flex; flex-direction:column; gap:0.15rem; }
.nav-item { display:flex; align-items:center; gap:10px; padding:0.65rem 0.85rem; border-radius:10px; font-size:0.875rem; font-weight:500; color:#6b7280; text-decoration:none; transition:background 0.15s,color 0.15s; position:relative; cursor:pointer; background:none; border:none; width:100%; font-family:inherit; text-align:left; }
.nav-item:hover { background:#eff6ff; color:#1a56db; }
.nav-item.active { background:#eff6ff; color:#1a56db; font-weight:600; }
.nav-item svg { width:18px; height:18px; flex-shrink:0; }
.nav-item .badge { margin-left:auto; background:#ef4444; color:#fff; font-size:0.65rem; font-weight:700; padding:2px 7px; border-radius:999px; }
.cerrar-sesion { color:#ef4444 !important; margin-top:0.5rem; }
.cerrar-sesion:hover { background:#fef2f2 !important; color:#dc2626 !important; }

/* ── CONTENIDO ── */
.app-main { flex:1; padding:2rem; overflow-x:hidden; }

/* ── FOOTER ── */
.app-footer { background:#fff; border-top:1px solid #e2e8f4; padding:0 2rem; height:52px; display:flex; align-items:center; justify-content:space-between; font-size:0.8rem; color:#9ca3af; }
.app-footer-left { display:flex; align-items:center; gap:16px; }
.app-footer-right { display:flex; gap:16px; }
.app-footer-right a { color:#6b7280; text-decoration:none; }
.app-footer-right a:hover { color:#1a56db; }
`;

// ── Ítems del sidebar ──
const NAV_ITEMS = [
  { ruta: "/dashboard",      label: "Inicio",                   icono: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
  { ruta: "/agendar",        label: "Agendar cita",             icono: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></> },
  { ruta: "/mis-citas",      label: "Mis citas",                icono: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></> },
  { ruta: "/historial",      label: "Historial clínico",        icono: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
  { ruta: "/notificaciones", label: "Notificaciones",           icono: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>, badge: true },
  { ruta: "/reportes",       label: "Reportes administrativos", icono: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></> },
  { ruta: "/ajustes",        label: "Ajustes de cuenta",        icono: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></> },
];

export default function Layout({ children }) {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { iniciales, nombreCompleto, usuario, logout } = useAuth();
  const [notifAbierto, setNotifAbierto] = useState(false);
  const [notifCount]                   = useState(3);

  // Inyectar estilos una sola vez
  useEffect(() => {
    if (document.getElementById("layout-styles")) return;
    const tag = document.createElement("style");
    tag.id        = "layout-styles";
    tag.innerHTML = styles;
    document.head.appendChild(tag);
  }, []);

  // Cerrar notif al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".notif-wrap")) setNotifAbierto(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const cerrarSesion = () => {
    logout();
    navigate("/login");
  };

  const rolLabel = usuario?.rol === "administrador" ? "Administrador"
    : usuario?.rol === "medico" ? "Médico"
    : "Paciente";

  return (
    <>
      {/* ── HEADER ── */}
      <header className="app-header">
        <span className="header-logo" onClick={() => navigate("/dashboard")}>
          <svg viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="10" fill="#fff" fillOpacity="0.2"/>
            <path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          MediAgenda
        </span>

        <div className="header-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar pacientes, citas, médicos..." />
        </div>

        <div className="header-right">
          {/* Notificaciones */}
          <div className="notif-wrap" onClick={e => { e.stopPropagation(); setNotifAbierto(p => !p); }}>
            <button className="notif-btn" aria-label="Notificaciones">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
            </button>
            <div className={`notif-dropdown${notifAbierto ? " active" : ""}`}>
              <div className="notif-header">
                <span>Notificaciones</span>
                <button onClick={() => setNotifAbierto(false)}>Marcar todas como leídas</button>
              </div>
              <div className="notif-footer">
                <a onClick={() => { navigate("/notificaciones"); setNotifAbierto(false); }} style={{ cursor: "pointer" }}>
                  Ver todas las notificaciones
                </a>
              </div>
            </div>
          </div>

          {/* Perfil */}
          <div className="profile-wrap">
            <div className="profile-avatar">{iniciales}</div>
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar-lg">{iniciales}</div>
                <div>
                  <p className="profile-nombre">{nombreCompleto}</p>
                  <p className="profile-rol">{rolLabel}</p>
                </div>
              </div>
              <div className="profile-divider" />
              <button className="profile-option" onClick={() => navigate("/ajustes")}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Editar perfil
              </button>
              <div className="profile-divider" />
              <button className="profile-option danger" onClick={cerrarSesion}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── LAYOUT ── */}
      <div className="app-layout">

        {/* ── SIDEBAR ── */}
        <aside className="app-aside">
          <nav className="sidebar-nav">
            {NAV_ITEMS.map(({ ruta, label, icono, badge }) => (
              <button
                key={ruta}
                className={`nav-item${location.pathname === ruta ? " active" : ""}`}
                onClick={() => navigate(ruta)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {icono}
                </svg>
                {label}
                {badge && notifCount > 0 && <span className="badge">{notifCount}</span>}
              </button>
            ))}
          </nav>
          <button className="nav-item cerrar-sesion" onClick={cerrarSesion}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Cerrar sesión
          </button>
        </aside>

        {/* ── CONTENIDO DE LA PÁGINA ── */}
        <main className="app-main">
          {children}
        </main>
      </div>

      {/* ── FOOTER ── */}
      <footer className="app-footer">
        <div className="app-footer-left">
          <svg viewBox="0 0 40 40" fill="none" width="20" height="20">
            <rect width="40" height="40" rx="10" fill="#1a56db"/>
            <path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          MediAgenda © 2025 &nbsp;•&nbsp; Todos los derechos reservados &nbsp;•&nbsp; Hecho en Colombia 🇨🇴
        </div>
        <div className="app-footer-right">
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
        </div>
      </footer>
    </>
  );
}