import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/PrivateRoute";

// Páginas públicas
import Login       from "../pages/Login";
import CrearCuenta from "../pages/CrearCuenta";

// Páginas privadas
import Dashboard      from "../pages/Dashboard";
import AgendarCita    from "../pages/AgendarCita";
import GestionCitas   from "../pages/GestionCitas";
import Historial      from "../pages/Historial";
import Notificaciones from "../pages/Notificaciones";
import Reportes       from "../pages/Reportes";
import Ajustes        from "../pages/Ajustes";

// =====================
// ROUTER PRINCIPAL
// =====================
export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── RUTAS PÚBLICAS ── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/registro" element={<CrearCuenta />} />

          {/* ── RUTAS PRIVADAS ── */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />

          <Route path="/agendar" element={
            <PrivateRoute><AgendarCita /></PrivateRoute>
          } />

          <Route path="/mis-citas" element={
            <PrivateRoute><GestionCitas /></PrivateRoute>
          } />

          <Route path="/historial" element={
            <PrivateRoute><Historial /></PrivateRoute>
          } />

          <Route path="/notificaciones" element={
            <PrivateRoute><Notificaciones /></PrivateRoute>
          } />

          <Route path="/reportes" element={
            <PrivateRoute><Reportes /></PrivateRoute>
          } />

          <Route path="/ajustes" element={
            <PrivateRoute><Ajustes /></PrivateRoute>
          } />

          {/* ── REDIRECCIONES ── */}
          {/* Raíz → login */}
          <Route path="/"  element={<Navigate to="/login" replace />} />
          {/* Cualquier ruta desconocida → login */}
          <Route path="*"  element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}