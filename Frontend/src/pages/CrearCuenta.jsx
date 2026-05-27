import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Plus Jakarta Sans',sans-serif; background:#f0f5ff; min-height:100vh; }

.reg-nav {
  background:#fff; border-bottom:1px solid #e2e8f4;
  padding:0 2rem; display:flex; align-items:center;
  justify-content:space-between; height:64px;
  position:sticky; top:0; z-index:100;
}
.reg-nav-logo {
  display:flex; align-items:center; gap:10px;
  font-weight:700; font-size:1.15rem; color:#1a56db; text-decoration:none;
}
.reg-nav-logo svg { width:32px; height:32px; }
.reg-nav-help {
  display:flex; align-items:center; gap:6px;
  background:#1a56db; color:#fff; padding:0.45rem 1rem;
  border-radius:8px; font-size:0.875rem; font-weight:500;
  text-decoration:none; transition:background 0.15s;
}
.reg-nav-help:hover { background:#1648c0; }

.reg-main {
  min-height:calc(100vh - 64px - 52px);
  display:grid; grid-template-columns:1fr 520px;
  gap:2rem; max-width:1200px; margin:0 auto;
  padding:3rem 2rem; align-items:center;
}
.reg-hero { padding-right:2rem; }
.reg-hero h1 { font-size:2.4rem; font-weight:700; line-height:1.18; color:#0f172a; margin-bottom:1rem; }
.reg-hero h1 span { color:#1a56db; }
.reg-hero p { font-size:1rem; color:#6b7280; line-height:1.7; margin-bottom:2rem; max-width:400px; }
.reg-features { display:flex; flex-direction:column; gap:1rem; }
.reg-feature-item { display:flex; align-items:flex-start; gap:12px; }
.reg-feature-icon { width:40px; height:40px; border-radius:10px; background:#eff6ff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.reg-feature-icon svg { width:20px; height:20px; }
.reg-feature-text strong { font-size:0.925rem; font-weight:600; color:#1e293b; display:block; }
.reg-feature-text span { font-size:0.825rem; color:#6b7280; }

.register-card {
  background:#fff; border-radius:20px; padding:2rem;
  box-shadow:0 4px 24px rgba(26,86,219,0.08),0 1px 4px rgba(0,0,0,0.04);
  border:1px solid #e8efff;
}
.card-logo { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:1rem; }
.card-logo svg { width:28px; height:28px; }
.card-logo span { font-size:1.1rem; font-weight:700; color:#1a56db; }

.alerta { display:flex; align-items:flex-start; gap:12px; padding:0.85rem 1rem; border-radius:10px; margin-bottom:1.25rem; font-size:0.85rem; line-height:1.5; }
.alerta-icono { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.alerta-texto strong { display:block; font-size:0.9rem; margin-bottom:2px; font-weight:600; }
.alerta-texto span { font-size:0.82rem; font-weight:400; }
.alerta-warning { background:#fff7ed; border:1px solid #fed7aa; }
.alerta-warning .alerta-icono { background:#fb923c; }
.alerta-warning .alerta-texto strong { color:#c2410c; }
.alerta-warning .alerta-texto span { color:#9a3412; }
.alerta-error { background:#fef2f2; border:1px solid #fecaca; }
.alerta-error .alerta-icono { background:#ef4444; }
.alerta-error .alerta-texto strong { color:#b91c1c; }
.alerta-error .alerta-texto span { color:#991b1b; }
.alerta-purple { background:#f5f3ff; border:1px solid #c4b5fd; }
.alerta-purple .alerta-icono { background:#7c3aed; }
.alerta-purple .alerta-texto strong { color:#5b21b6; }
.alerta-purple .alerta-texto span { color:#4c1d95; }
.alerta-success { background:#f0fdf4; border:1px solid #bbf7d0; }
.alerta-success .alerta-icono { background:#22c55e; }
.alerta-success .alerta-texto strong { color:#15803d; }
.alerta-success .alerta-texto span { color:#166534; }

.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.field { margin-bottom:0.85rem; }
.field label { font-size:0.82rem; font-weight:600; color:#374151; display:block; margin-bottom:5px; }
.req { color:#ef4444; }
.input-wrap { display:flex; align-items:center; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 12px; transition:border-color 0.15s,box-shadow 0.15s; background:#fafbff; }
.input-wrap:focus-within { border-color:#1a56db; box-shadow:0 0 0 3px rgba(26,86,219,0.1); background:#fff; }
.input-wrap.error { border-color:#ef4444; background:#fff5f5; }
.input-wrap svg { width:16px; height:16px; color:#9ca3af; flex-shrink:0; }
.input-wrap input, .input-wrap select { flex:1; border:none; background:transparent; padding:10px 8px; font-size:0.85rem; color:#1e293b; outline:none; font-family:inherit; min-width:0; }
.input-wrap input::placeholder { color:#c4c9d4; }
.input-wrap select { cursor:pointer; appearance:none; }
.eye-btn { background:none; border:none; cursor:pointer; display:flex; align-items:center; padding:0; }
.eye-btn svg { width:16px; height:16px; color:#9ca3af; }
.field-error { font-size:0.78rem; color:#ef4444; margin-top:4px; min-height:16px; }

.terms-check { display:flex; align-items:center; gap:8px; margin-bottom:0.25rem; font-size:0.82rem; }
.terms-check input[type="checkbox"] { accent-color:#1a56db; width:15px; height:15px; flex-shrink:0; }
.terms-check label { color:#6b7280; cursor:pointer; }
.terms-check a { color:#1a56db; text-decoration:none; }
.terms-check a:hover { text-decoration:underline; }
.terms-check.error-check input[type="checkbox"] { outline:2px solid #ef4444; border-radius:3px; }

.btn-primary { width:100%; padding:12px; background:#1a56db; color:#fff; font-size:0.95rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; transition:background 0.15s,transform 0.1s; font-family:inherit; margin-bottom:0.75rem; margin-top:0.75rem; }
.btn-primary:hover { background:#1648c0; }
.btn-primary:active { transform:scale(0.99); }
.btn-secondary { width:100%; padding:12px; background:transparent; color:#1a56db; font-size:0.95rem; font-weight:600; border:1.5px solid #1a56db; border-radius:10px; cursor:pointer; transition:background 0.15s; font-family:inherit; }
.btn-secondary:hover { background:#eff6ff; }

.exito-icono { width:90px; height:90px; border-radius:50%; background:#f0fdf4; border:2px solid #bbf7d0; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem; }
.exito-alerta { display:flex; align-items:center; justify-content:center; gap:8px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:0.75rem 1rem; font-size:0.85rem; color:#15803d; font-weight:500; }
.btn-reenviar { display:flex; align-items:center; justify-content:center; gap:6px; width:100%; padding:10px; background:transparent; color:#1a56db; font-size:0.875rem; font-weight:600; border:none; cursor:pointer; font-family:inherit; margin-top:0.5rem; }
.btn-reenviar:hover { text-decoration:underline; }

.modal-overlay { display:none; position:fixed; inset:0; background:rgba(15,23,42,0.5); z-index:999; align-items:center; justify-content:center; }
.modal-overlay.active { display:flex; }
.modal-box { background:#fff; border-radius:16px; width:90%; max-width:600px; max-height:90vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 8px 40px rgba(26,86,219,0.15); }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:1rem 1.5rem; border-bottom:1px solid #e2e8f4; }
.modal-logo { display:flex; align-items:center; gap:8px; font-weight:700; font-size:1rem; color:#1a56db; }
.modal-nav-link { font-size:0.85rem; color:#6b7280; text-decoration:none; font-weight:500; background:none; border:none; cursor:pointer; font-family:inherit; }
.modal-nav-link:hover { color:#1a56db; }
.modal-body { padding:1.5rem; overflow-y:auto; flex:1; }
.modal-body h2 { font-size:1.15rem; font-weight:700; color:#0f172a; margin-bottom:0.5rem; }
.modal-intro { font-size:0.85rem; color:#6b7280; line-height:1.6; margin-bottom:1.25rem; }
.termino-item { background:#f0f5ff; border-radius:10px; padding:0.85rem 1rem; margin-bottom:0.75rem; }
.termino-item h3 { font-size:0.875rem; font-weight:600; color:#1a56db; margin-bottom:0.4rem; }
.termino-item p { font-size:0.82rem; color:#4b5563; line-height:1.6; }
.modal-importante { background:#fffbeb; border:1px solid #fcd34d; border-radius:10px; padding:0.85rem 1rem; margin-top:0.5rem; }
.modal-importante span { font-size:0.85rem; font-weight:600; color:#b45309; display:block; margin-bottom:0.3rem; }
.modal-importante p { font-size:0.82rem; color:#78350f; line-height:1.6; }
.modal-footer { padding:1rem 1.5rem; border-top:1px solid #e2e8f4; }
.btn-aceptar { width:100%; padding:12px; background:#1a56db; color:#fff; font-size:0.95rem; font-weight:600; border:none; border-radius:10px; cursor:pointer; transition:background 0.15s; font-family:inherit; }
.btn-aceptar:hover { background:#1648c0; }

.reg-footer { background:#fff; border-top:1px solid #e2e8f4; padding:0 2rem; height:52px; display:flex; align-items:center; justify-content:space-between; font-size:0.8rem; color:#9ca3af; }
.reg-footer-left { display:flex; align-items:center; gap:16px; }
.reg-footer-right { display:flex; gap:16px; }
.reg-footer-right a { color:#6b7280; text-decoration:none; }
.reg-footer-right a:hover { color:#1a56db; }
`;

const TERMINOS = [
  ["1. Aceptación del servicio", "El usuario acepta utilizar MediAgenda de manera responsable, únicamente para gestionar información relacionada con citas médicas, usuarios, notificaciones y servicios autorizados por la plataforma."],
  ["2. Registro de usuario", "Para acceder a las funciones del sistema, el usuario debe registrar información real, completa y actualizada. El correo electrónico será usado para verificar la cuenta y enviar comunicaciones del servicio."],
  ["3. Uso de la información personal", "Los datos suministrados serán tratados con fines de identificación, gestión de citas, envío de recordatorios, administración de usuarios y mejora del servicio."],
  ["4. Protección de datos médicos", "La información clínica o sensible solo podrá ser consultada por usuarios autorizados según su rol dentro del sistema."],
  ["5. Responsabilidad del usuario", "El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de cerrar sesión cuando utilice equipos compartidos o públicos."],
  ["6. Gestión de citas médicas", "El sistema permite agendar, modificar, cancelar y consultar citas de acuerdo con la disponibilidad registrada por la institución o el profesional de salud."],
  ["7. Notificaciones y recordatorios", "MediAgenda podrá enviar recordatorios por correo electrónico o SMS sobre citas programadas, cambios o cancelaciones."],
  ["8. Restricciones de uso", "No está permitido alterar el funcionamiento del sistema, ingresar información falsa o acceder a cuentas ajenas."],
  ["9. Actualización de condiciones", "MediAgenda podrá actualizar estos términos cuando sea necesario. Los cambios serán informados dentro de la plataforma."],
];

export default function CrearCuenta() {
  const navigate = useNavigate();

  // ── Estado del formulario ──
  const [form, setForm] = useState({
    nombres: "", apellidos: "", tipodoc: "", numdoc: "",
    correo: "", telefono: "", pass1: "", pass2: "", rol: "",
  });
  const [terminos,      setTerminos]      = useState(false);
  const [mostrarPass1,  setMostrarPass1]  = useState(false);
  const [mostrarPass2,  setMostrarPass2]  = useState(false);
  const [errores,       setErrores]       = useState({});
  const [alerta,        setAlerta]        = useState(null);
  const [exito,         setExito]         = useState(false);
  const [modalAbierto,  setModalAbierto]  = useState(false);

  // Inyectar estilos
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrores(prev => ({ ...prev, [e.target.name]: false }));
  };

  // ── Validar y registrar ──
  const validarFormulario = async () => {
    setAlerta(null);
    const nuevosErrores = {};
    let hayVacios = false;

    ["nombres","apellidos","tipodoc","numdoc","correo","telefono","pass1","pass2"].forEach(campo => {
      if (!form[campo]) { nuevosErrores[campo] = true; hayVacios = true; }
    });

    if (hayVacios) {
      setErrores(nuevosErrores);
      setAlerta({ tipo: "warning", titulo: "Campos vacíos", mensaje: "Todos los campos obligatorios deben ser completados." });
      return;
    }

    if (form.pass1 !== form.pass2) {
      setErrores(prev => ({ ...prev, pass2: true }));
      setAlerta({ tipo: "error", titulo: "Las contraseñas no coinciden", mensaje: "Las contraseñas ingresadas no coinciden." });
      return;
    }

    if (form.pass1.length < 6) {
      setAlerta({ tipo: "error", titulo: "Contraseña muy corta", mensaje: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (!terminos) {
      setErrores(prev => ({ ...prev, terminos: true }));
      setAlerta({ tipo: "error", titulo: "Términos no aceptados", mensaje: "Debes aceptar los términos y condiciones." });
      return;
    }

    try {
      const res = await fetch(`${API}/auth/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre:         form.nombres,
          apellido:       form.apellidos,
          correo:         form.correo,
          contrasena:     form.pass1,
          telefono:       form.telefono,
          tipo_documento: form.tipodoc,
          num_documento:  form.numdoc,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes("correo")) {
          setErrores(prev => ({ ...prev, correo: true }));
          setAlerta({ tipo: "purple", titulo: "Correo ya registrado", mensaje: "Este correo ya se encuentra registrado en MediAgenda." });
        } else {
          setAlerta({ tipo: "error", titulo: "Error al registrar", mensaje: data.error || "Ocurrió un error. Intenta de nuevo." });
        }
        return;
      }

      setExito(true);

    } catch {
      setAlerta({ tipo: "error", titulo: "Error de conexión", mensaje: "No se pudo conectar con el servidor." });
    }
  };

  const aceptarTerminos = () => {
    setTerminos(true);
    setModalAbierto(false);
    setErrores(prev => ({ ...prev, terminos: false }));
  };

  // ── PANTALLA ÉXITO ──
  if (exito) {
    return (
      <>
        <nav className="reg-nav">
          <a className="reg-nav-logo" href="#">
            <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1a56db"/><path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            MediAgenda
          </a>
        </nav>
        <main className="reg-main">
          <div className="reg-hero">
            <h1>Bienvenido a<br /><span>MediAgenda</span></h1>
            <p>Gestiona tus citas médicas de forma fácil, segura y eficiente.</p>
          </div>
          <div className="register-card" style={{ textAlign: "center", padding: "2rem" }}>
            <div className="exito-icono">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>Registro exitoso</h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Tu cuenta ha sido creada correctamente. Para activar tu perfil en MediAgenda, verifica el correo electrónico registrado.
            </p>
            <div className="exito-alerta">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Hemos enviado un enlace de verificación a tu correo.
            </div>
            <button className="btn-primary" onClick={() => navigate("/login")} style={{ marginTop: "1.25rem" }}>
              Volver al inicio de sesión
            </button>
          </div>
        </main>
      </>
    );
  }

  // ── FORMULARIO ──
  return (
    <>
      {/* NAVBAR */}
      <nav className="reg-nav">
        <a className="reg-nav-logo" href="#">
          <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1a56db"/><path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          MediAgenda
        </a>
        <a href="#" className="reg-nav-help">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/></svg>
          ¿Necesitas ayuda?
        </a>
      </nav>

      {/* MAIN */}
      <main className="reg-main">

        {/* HERO */}
        <div className="reg-hero">
          <h1>Bienvenido a<br /><span>MediAgenda</span></h1>
          <p>Gestiona tus citas médicas de forma fácil, segura y eficiente.</p>
          <div className="reg-features">
            {[
              { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, titulo: "Agenda y administra", sub: "tus citas médicas" },
              { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, titulo: "Accede de forma segura", sub: "a tu información" },
              { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, titulo: "Atención médica", sub: "más organizada" },
            ].map(({ icon, titulo, sub }) => (
              <div className="reg-feature-item" key={titulo}>
                <div className="reg-feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                </div>
                <div className="reg-feature-text">
                  <strong>{titulo}</strong>
                  <span>{sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARJETA */}
        <div className="register-card">
          <div className="card-logo">
            <svg viewBox="0 0 40 40" fill="none"><rect width="40" height="40" rx="10" fill="#1a56db"/><path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span>MediAgenda</span>
          </div>

          {/* ALERTA */}
          {alerta && (
            <div className={`alerta alerta-${alerta.tipo}`}>
              <div className="alerta-icono">
                {alerta.tipo === "warning" && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>}
                {alerta.tipo === "error"   && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>}
                {alerta.tipo === "purple"  && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
              </div>
              <div className="alerta-texto">
                <strong>{alerta.titulo}</strong>
                <span>{alerta.mensaje}</span>
              </div>
            </div>
          )}

          {/* NOMBRES Y APELLIDOS */}
          <div className="form-row">
            <div className="field">
              <label>Nombres <span className="req">*</span></label>
              <div className={`input-wrap${errores.nombres ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input name="nombres" value={form.nombres} onChange={handleChange} placeholder="Ingresa tus nombres" />
              </div>
            </div>
            <div className="field">
              <label>Apellidos <span className="req">*</span></label>
              <div className={`input-wrap${errores.apellidos ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Ingresa tus apellidos" />
              </div>
            </div>
          </div>

          {/* TIPO DOC Y NÚMERO */}
          <div className="form-row">
            <div className="field">
              <label>Tipo de documento <span className="req">*</span></label>
              <div className={`input-wrap${errores.tipodoc ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>
                <select name="tipodoc" value={form.tipodoc} onChange={handleChange}>
                  <option value="" disabled>Selecciona el tipo</option>
                  <option value="cc">Cédula de ciudadanía</option>
                  <option value="ce">Cédula de extranjería</option>
                  <option value="ti">Tarjeta de identidad</option>
                  <option value="pa">Pasaporte</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Número de documento <span className="req">*</span></label>
              <div className={`input-wrap${errores.numdoc ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/></svg>
                <input name="numdoc" value={form.numdoc} onChange={handleChange} placeholder="Número de documento" />
              </div>
            </div>
          </div>

          {/* CORREO Y TELÉFONO */}
          <div className="form-row">
            <div className="field">
              <label>Correo electrónico <span className="req">*</span></label>
              <div className={`input-wrap${errores.correo ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="ejemplo@correo.com" />
              </div>
            </div>
            <div className="field">
              <label>Número telefónico <span className="req">*</span></label>
              <div className={`input-wrap${errores.telefono ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.08 3.42 2 2 0 0 1 3.06 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6.29 6.29l1.32-1.22a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="300 000 0000" />
              </div>
            </div>
          </div>

          {/* CONTRASEÑAS */}
          <div className="form-row">
            <div className="field">
              <label>Contraseña <span className="req">*</span></label>
              <div className={`input-wrap${errores.pass1 ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input name="pass1" type={mostrarPass1 ? "text" : "password"} value={form.pass1} onChange={handleChange} placeholder="Crea una contraseña" />
                <button className="eye-btn" onClick={() => setMostrarPass1(!mostrarPass1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <div className="field">
              <label>Confirmar contraseña <span className="req">*</span></label>
              <div className={`input-wrap${errores.pass2 ? " error" : ""}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input name="pass2" type={mostrarPass2 ? "text" : "password"} value={form.pass2} onChange={handleChange} placeholder="Confirma tu contraseña" />
                <button className="eye-btn" onClick={() => setMostrarPass2(!mostrarPass2)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* TÉRMINOS */}
          <div className={`terms-check${errores.terminos ? " error-check" : ""}`}>
            <input type="checkbox" id="terminos" checked={terminos} onChange={e => { setTerminos(e.target.checked); setErrores(p => ({...p, terminos: false})); }} />
            <label htmlFor="terminos">
              Acepto los{" "}
              <a href="#" onClick={e => { e.preventDefault(); setModalAbierto(true); }}>términos y condiciones</a>
            </label>
          </div>

          <button className="btn-primary" onClick={validarFormulario}>Crear cuenta</button>
          <button className="btn-secondary" onClick={() => navigate("/login")}>Iniciar sesión</button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="reg-footer">
        <div className="reg-footer-left">
          <svg viewBox="0 0 40 40" fill="none" width="20" height="20"><rect width="40" height="40" rx="10" fill="#1a56db"/><path d="M20 13V27M13 20H27" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          MediAgenda © 2025 &nbsp;•&nbsp; Todos los derechos reservados &nbsp;•&nbsp; Hecho en Colombia 🇨🇴
        </div>
        <div className="reg-footer-right">
          <a href="#">Términos y condiciones</a>
          <a href="#">Política de privacidad</a>
        </div>
      </footer>

      {/* MODAL TÉRMINOS */}
      <div className={`modal-overlay${modalAbierto ? " active" : ""}`} onClick={e => { if (e.target === e.currentTarget) setModalAbierto(false); }}>
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
            <p className="modal-intro">Bienvenido a MediAgenda. Al crear una cuenta y utilizar la plataforma, el usuario acepta las siguientes condiciones de uso.</p>
            {TERMINOS.map(([titulo, texto]) => (
              <div className="termino-item" key={titulo}>
                <h3>{titulo}</h3><p>{texto}</p>
              </div>
            ))}
            <div className="modal-importante">
              <span>⚠ Importante</span>
              <p>La aceptación de estos términos es obligatoria para completar el registro.</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-aceptar" onClick={aceptarTerminos}>Aceptar y continuar</button>
          </div>
        </div>
      </div>
    </>
  );
}