import { createContext, useContext, useState, useEffect } from "react";

// =====================
// CONTEXTO
// =====================
const AuthContext = createContext(null);

// =====================
// PROVEEDOR
// =====================
export function AuthProvider({ children }) {
  const [token, setToken]     = useState(() => localStorage.getItem("token"));
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem("usuario");
    return u ? JSON.parse(u) : null;
  });

  // Guardar token en localStorage cada vez que cambie
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Guardar usuario en localStorage cada vez que cambie
  useEffect(() => {
    if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
    else localStorage.removeItem("usuario");
  }, [usuario]);

  // Iniciar sesión: guarda token y datos del usuario
  function login(nuevoToken, datosUsuario) {
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  }

  // Cerrar sesión: limpia todo
  function logout() {
    setToken(null);
    setUsuario(null);
  }

  // Actualizar datos del usuario (para la página de Ajustes)
  function actualizarUsuario(nuevosDatos) {
    setUsuario(prev => ({ ...prev, ...nuevosDatos }));
  }

  // Iniciales del avatar (ej: "JR" de "Juan Ramírez")
  const iniciales = usuario
    ? `${usuario.nombre?.[0] || ""}${usuario.apellido?.[0] || ""}`.toUpperCase()
    : "?";

  // Nombre completo
  const nombreCompleto = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim()
    : "Usuario";

  return (
    <AuthContext.Provider value={{
      token,
      usuario,
      iniciales,
      nombreCompleto,
      estaAutenticado: !!token,
      login,
      logout,
      actualizarUsuario,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// =====================
// HOOK para usar en cualquier componente
// Ejemplo: const { usuario, logout } = useAuth();
// =====================
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}