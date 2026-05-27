import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

// =====================
// ESTILOS (equivalente a styles.css)
// =====================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: #f0f5ff;
    min-height: 100vh;
  }

  .login-nav {
    background: #fff;
    border-bottom: 1px solid #e2e8f4;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 1.15rem;
    color: #1a56db;
    text-decoration: none;
  }

  .nav-logo svg { width: 32px; height: 32px; }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
  }

  .nav-links a {
    padding: 0.45rem 0.85rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4b5563;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-links a:hover, .nav-links a.active {
    background: #eff6ff;
    color: #1a56db;
  }

  .nav-links a svg { width: 16px; height: 16px; flex-shrink: 0; }

  .nav-help {
    background: #1a56db !important;
    color: #fff !important;
    padding: 0.45rem 1rem !important;
    border-radius: 8px !important;
  }

  .nav-help:hover { background: #1648c0 !important; color: #fff !important; }

  .login-main {
    min-height: calc(100vh - 64px - 52px);
    display: grid;
    grid-template-columns: 1fr 460px;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
    align-items: center;
  }

  .hero { padding-right: 2rem; }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #eff6ff;
    color: #1a56db;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 999px;
    margin-bottom: 1.25rem;
    letter-spacing: 0.02em;
  }

  .hero h1 {
    font-size: 2.6rem;
    font-weight: 700;
    line-height: 1.18;
    color: #0f172a;
    margin-bottom: 1rem;
  }

  .hero h1 span { color: #1a56db; }

  .hero p {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 420px;
  }

  .features { display: flex; flex-direction: column; gap: 1rem; }

  .feature-item { display: flex; align-items: flex-start; gap: 12px; }

  .feature-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .feature-icon svg { width: 20px; height: 20px; }

  .feature-text strong {
    font-size: 0.925rem;
    font-weight: 600;
    color: #1e293b;
    display: block;
  }

  .feature-text span { font-size: 0.825rem; color: #6b7280; }

  .login-card {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 4px 24px rgba(26,86,219,0.08), 0 1px 4px rgba(0,0,0,0.04);
    border: 1px solid #e8efff;
  }

  .card-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 0.5rem;
  }

  .card-logo svg { width: 28px; height: 28px; }

  .card-logo span { font-size: 1.1rem; font-weight: 700; color: #1a56db; }

  .login-card h2 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 0.35rem;
  }

  .login-card .subtitle {
    text-align: center;
    font-size: 0.85rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .alerta {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .alerta-icono {
    width: 32px; height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .alerta-texto strong { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 2px; }
  .alerta-texto span { font-size: 0.82rem; font-weight: 400; }

  .alerta-error { background: #fef2f2; border: 1px solid #fecaca; }
  .alerta-error .alerta-icono { background: #ef4444; }
  .alerta-error .alerta-texto strong { color: #b91c1c; }
  .alerta-error .alerta-texto span { color: #991b1b; }

  .alerta-warning { background: #fff7ed; border: 1px solid #fed7aa; }
  .alerta-warning .alerta-icono { background: #fb923c; }
  .alerta-warning .alerta-texto strong { color: #c2410c; }
  .alerta-warning .alerta-texto span { color: #9a3412; }

  .alerta-success { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .alerta-success .alerta-icono { background: #22c55e; }
  .alerta-success .alerta-texto strong { color: #15803d; }
  .alerta-success .alerta-texto span { color: #166534; }

  .field { margin-bottom: 1.1rem; }

  .field label {
    font-size: 0.82rem;
    font-weight: 600;
    color: #374151;
    display: block;
    margin-bottom: 6px;
  }

  .type-selector {
    display: flex;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .type-btn {
    flex: 1;
    padding: 8px 4px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    font-family: inherit;
  }

  .type-btn.active { background: #1a56db; color: #fff; }
  .type-btn:not(.active):hover { background: #f0f5ff; color: #1a56db; }

  .input-wrap {
    display: flex;
    align-items: center;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    padding: 0 12px;
    transition: border-color 0.15s, box-shadow 0.15s;
    background: #fafbff;
  }

  .input-wrap:focus-within {
    border-color: #1a56db;
    box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
    background: #fff;
  }

  .input-wrap.error { border-color: #ef4444; background: #fff5f5; }

  .input-wrap svg { width: 17px; height: 17px; color: #9ca3af; flex-shrink: 0; }

  .input-wrap input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 11px 10px;
    font-size: 0.9rem;
    color: #1e293b;
    outline: none;
    font-family: inherit;
  }

  .input-wrap input::placeholder { color: #c4c9d4; }

  .eye-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; }
  .eye-btn svg { width: 17px; height: 17px; color: #9ca3af; }

  .input-hint { font-size: 0.75rem; color: #9ca3af; margin-top: 4px; }

  .row-check {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    font-size: 0.82rem;
  }

  .row-check label { display: flex; align-items: center; gap: 6px; color: #6b7280; cursor: pointer; }
  .row-check input[type="checkbox"] { accent-color: #1a56db; width: 15px; height: 15px; }

  .forgot { color: #1a56db; text-decoration: none; font-weight: 500; }
  .forgot:hover { text-decoration: underline; }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: #1a56db;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    font-family: inherit;
    margin-bottom: 0.75rem;
  }

  .btn-primary:hover { background: #1648c0; }
  .btn-primary:active { transform: scale(0.99); }

  .btn-secondary {
    width: 100%;
    padding: 12px;
    background: transparent;
    color: #1a56db;
    font-size: 0.95rem;
    font-weight: 600;
    border: 1.5px solid #1a56db;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
    margin-bottom: 1.25rem;
  }

  .btn-secondary:hover { background: #eff6ff; }

  .terms { text-align: center; font-size: 0.78rem; color: #9ca3af; line-height: 1.5; }
  .terms a { color: #1a56db; text-decoration: none; }
  .terms a:hover { text-decoration: underline; }

  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(15,23,42,0.5);
    z-index: 999;
    align-items: center;
    justify-content: center;
  }

  .modal-overlay.active { display: flex; }

  .modal-box {
    background: #fff;
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(26,86,219,0.15);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f4;
  }

  .modal-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 1rem; color: #1a56db; }

  .modal-nav-link { font-size: 0.85rem; color: #6b7280; text-decoration: none; font-weight: 500; background: none; border: none; cursor: pointer; font-family: inherit; }
  .modal-nav-link:hover { color: #1a56db; }

  .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
  .modal-body h2 { font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 0.5rem; }

  .modal-intro { font-size: 0.85rem; color: #6b7280; line-height: 1.6; margin-bottom: 1.25rem; }

  .termino-item { background: #f0f5ff; border-radius: 10px; padding: 0.85rem 1rem; margin-bottom: 0.75rem; }
  .termino-item h3 { font-size: 0.875rem; font-weight: 600; color: #1a56db; margin-bottom: 0.4rem; }
  .termino-item p { font-size: 0.82rem; color: #4b5563; line-height: 1.6; }

  .modal-importante { background: #fffbeb; border: 1px solid #fcd34d; border-radius: 10px; padding: 0.85rem 1rem; margin-top: 0.5rem; }
  .modal-importante span { font-size: 0.85rem; font-weight: 600; color: #b45309; display: block; margin-bottom: 0.3rem; }
  .modal-importante p { font-size: 0.82rem; color: #78350f; line-height: 1.6; }

  .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #e2e8f4; }

  .btn-aceptar {
    width: 100%;
    padding: 12px;
    background: #1a56db;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
    font-family: inherit;
  }

  .btn-aceptar:hover { background: #1648c0; }

  .login-footer {
    background: #fff;
    border-top: 1px solid #e2e8f4;
    padding: 0 2rem;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #9ca3af;
  }

  .footer-left { display: flex; align-items: center; gap: 16px; }
  .footer-right { display: flex; gap: 16px; }
  .footer-right a { color: #6b7280; text-decoration: none; }
  .footer-right a:hover { color: #1a56db; }
`;

// =====================
// ÍCONOS SVG reutilizables
// =====================
const LogoIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#1a56db"/>
    <path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// =====================
// COMPONENTE PRINCIPAL
// =====================
export default function Login() {
  const navigate = useNavigate();
  const [tipoAcceso, setTipoAcceso] = useState("email");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [recordarme, setRecordarme] = useState(false);
  const [alerta, setAlerta] = useState(null); // { tipo, titulo, mensaje }
  const [errorUsuario, setErrorUsuario] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Inyectar estilos globales una sola vez
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Configuración según tipo de acceso
  const tipoConfig = {
    email: { placeholder: "ejemplo@correo.com", hint: "Ingresa tu correo electrónico registrado", inputType: "text" },
    doc:   { placeholder: "Número de documento",  hint: "Ingresa tu número de documento de identidad", inputType: "text" },
    phone: { placeholder: "300 000 0000",          hint: "Ingresa tu número de teléfono registrado",   inputType: "tel" },
  };

  const { placeholder, hint, inputType } = tipoConfig[tipoAcceso];

  // =====================
  // LOGIN
  // =====================
  const validarLogin = async () => {
    setAlerta(null);
    setErrorUsuario(false);
    setErrorPass(false);

    if (!usuario || !password) {
      if (!usuario) setErrorUsuario(true);
      if (!password) setErrorPass(true);
      setAlerta({ tipo: "error", titulo: "Campos vacíos", mensaje: "Todos los campos son obligatorios." });
      return;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: usuario, contrasena: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorUsuario(true);
        setErrorPass(true);
        setAlerta({ tipo: "error", titulo: "Credenciales incorrectas", mensaje: data.error || "Correo o contraseña incorrectos." });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setAlerta({ tipo: "success", titulo: "¡Bienvenido!", mensaje: `Hola ${data.usuario.nombre}, redirigiendo...` });
      setTimeout(() => (window.location.href = "/dashboard"), 1000);

    } catch {
      setAlerta({ tipo: "error", titulo: "Error de conexión", mensaje: "No se pudo conectar con el servidor." });
    }
  };

  // =====================
  // RENDER
  // =====================
  return (
    <>
      {/* NAVBAR */}
      <nav className="login-nav">
        <a className="nav-logo" href="#">
          <LogoIcon />
          MediAgenda
        </a>
        <ul className="nav-links">
          <li><a href="#" className="active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Inicio
          </a></li>
          <li><a href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Acerca de nosotros
          </a></li>
          <li><a href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.42 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6.29 6.29l1.32-1.22a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            Contacto
          </a></li>
          <li><a href="#">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            Tutorial
          </a></li>
          <li><a href="#" className="nav-help">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
            ¿Necesitas ayuda?
          </a></li>
        </ul>
      </nav>

      {/* MAIN */}
      <main className="login-main">

        {/* HERO IZQUIERDO */}
        <div className="hero">
          <div className="hero-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Plataforma médica certificada
          </div>
          <h1>Bienvenido a<br /><span>MediAgenda</span></h1>
          <p>Gestiona tus citas médicas de forma fácil, segura y eficiente.</p>
          <div className="features">
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div className="feature-text">
                <strong>Agenda y administra</strong>
                <span>tus citas médicas</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div className="feature-text">
                <strong>Accede de forma segura</strong>
                <span>a tu información</span>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="feature-text">
                <strong>Atención médica</strong>
                <span>más organizada</span>
              </div>
            </div>
          </div>
        </div>

        {/* TARJETA LOGIN */}
        <div className="login-card">
          <div className="card-logo">
            <LogoIcon />
            <span>MediAgenda</span>
          </div>
          <h2>Iniciar sesión</h2>
          <p className="subtitle">Accede a tu cuenta para gestionar tus citas médicas</p>

          {/* ALERTA */}
          {alerta && (
            <div className={`alerta alerta-${alerta.tipo}`}>
              <div className="alerta-icono">
                {alerta.tipo === "error" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                )}
                {alerta.tipo === "warning" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                )}
                {alerta.tipo === "success" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </div>
              <div className="alerta-texto">
                <strong>{alerta.titulo}</strong>
                <span>{alerta.mensaje}</span>
              </div>
            </div>
          )}

          {/* TIPO DE ACCESO */}
          <div className="field">
            <label>Tipo de acceso</label>
            <div className="type-selector">
              {["email", "doc", "phone"].map((tipo) => (
                <button
                  key={tipo}
                  className={`type-btn${tipoAcceso === tipo ? " active" : ""}`}
                  onClick={() => { setTipoAcceso(tipo); setUsuario(""); }}
                >
                  {tipo === "email" ? "📧 Correo" : tipo === "doc" ? "🪪 Documento" : "📱 Teléfono"}
                </button>
              ))}
            </div>
            <div className={`input-wrap${errorUsuario ? " error" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type={inputType}
                placeholder={placeholder}
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>
            <p className="input-hint">{hint}</p>
          </div>

          {/* CONTRASEÑA */}
          <div className="field">
            <label>Contraseña</label>
            <div className={`input-wrap${errorPass ? " error" : ""}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={mostrarPass ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="eye-btn" onClick={() => setMostrarPass(!mostrarPass)} aria-label="Mostrar contraseña">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          {/* RECORDARME */}
          <div className="row-check">
            <label>
              <input type="checkbox" checked={recordarme} onChange={(e) => setRecordarme(e.target.checked)} />
              Recordarme
            </label>
            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
          </div>

          <button className="btn-primary" onClick={validarLogin}>Iniciar sesión</button>
          <button className="btn-secondary" onClick={() => navigate("/registro")}>Crear cuenta</button>

          <div className="terms">
            Al continuar aceptas los{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setModalAbierto(true); }}>términos y condiciones</a>
            {" "}y la{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setModalAbierto(true); }}>política de privacidad</a>.
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="login-footer">
        <div className="footer-left">
          <svg viewBox="0 0 40 40" fill="none" width="20" height="20">
            <rect width="40" height="40" rx="10" fill="#1a56db"/>
            <path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          MediAgenda © 2025 &nbsp;•&nbsp; Todos los derechos reservados &nbsp;•&nbsp; Hecho en Colombia 🇨🇴
        </div>
        <div className="footer-right">
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
        </div>
      </footer>

      {/* MODAL TÉRMINOS */}
      <div className={`modal-overlay${modalAbierto ? " active" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setModalAbierto(false); }}>
        <div className="modal-box">
          <div className="modal-header">
            <div className="modal-logo">
              <svg viewBox="0 0 40 40" fill="none" width="22" height="22"><rect width="40" height="40" rx="10" fill="#1a56db"/><path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              <span>MediAgenda</span>
            </div>
            <button className="modal-nav-link" onClick={() => setModalAbierto(false)}>✕ Cerrar</button>
          </div>
          <div className="modal-body">
            <h2>Términos y condiciones de uso - MediAgenda</h2>
            <p className="modal-intro">Bienvenido a MediAgenda, sistema digital para la gestión de citas médicas. Al crear una cuenta y utilizar la plataforma, el usuario acepta las siguientes condiciones de uso.</p>
            {[
              ["1. Aceptación del servicio", "El usuario acepta utilizar MediAgenda de manera responsable, únicamente para gestionar información relacionada con citas médicas, usuarios, notificaciones y servicios autorizados por la plataforma."],
              ["2. Registro de usuario", "Para acceder a las funciones del sistema, el usuario debe registrar información real, completa y actualizada. El correo electrónico será usado para verificar la cuenta y enviar comunicaciones del servicio."],
              ["3. Uso de la información personal", "Los datos suministrados serán tratados con fines de identificación, gestión de citas, envío de recordatorios, administración de usuarios y mejora del servicio."],
              ["4. Protección de datos médicos", "La información clínica o sensible solo podrá ser consultada por usuarios autorizados según su rol dentro del sistema."],
              ["5. Responsabilidad del usuario", "El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de cerrar sesión cuando utilice equipos compartidos."],
              ["6. Gestión de citas médicas", "El sistema permite agendar, modificar, cancelar y consultar citas de acuerdo con la disponibilidad registrada."],
              ["7. Notificaciones y recordatorios", "MediAgenda podrá enviar recordatorios por correo electrónico o SMS sobre citas programadas, cambios o cancelaciones."],
              ["8. Restricciones de uso", "No está permitido alterar el funcionamiento del sistema, ingresar información falsa o acceder a cuentas ajenas."],
              ["9. Actualización de condiciones", "MediAgenda podrá actualizar estos términos cuando sea necesario. Los cambios serán informados dentro de la plataforma."],
            ].map(([titulo, texto]) => (
              <div className="termino-item" key={titulo}>
                <h3>{titulo}</h3>
                <p>{texto}</p>
              </div>
            ))}
            <div className="modal-importante">
              <span>⚠ Importante</span>
              <p>La aceptación de estos términos y condiciones es obligatoria para completar el registro. Si no estás de acuerdo, no podrás acceder a los servicios de MediAgenda.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-aceptar" onClick={() => setModalAbierto(false)}>Entendido</button>
          </div>
        </div>
      </div>
    </>
  );
}