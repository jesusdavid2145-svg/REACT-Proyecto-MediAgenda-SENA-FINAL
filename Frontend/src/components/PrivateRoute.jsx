import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// =====================
// RUTA PRIVADA
// Si el usuario NO está autenticado, redirige a /login
// Si SÍ está autenticado, muestra el componente normalmente
//
// Uso en AppRouter.jsx:
// <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
// =====================
export default function PrivateRoute({ children }) {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}