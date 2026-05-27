function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>MediAgenda</span>
      </div>

      <div className="navbar-links">
        <a href="#">Inicio</a>
        <a href="#">Acerca de Nosotros</a>
        <a href="#">Servicios</a>
        <a href="#">Especialidades</a>
        <a href="#">Tutorial</a>
        <a href="#">Contacto</a>
      </div>

      <div className="navbar-help">
        <a href="#">¿Necesitas ayuda?</a>
      </div>
    </nav>
  );
}

export default Navbar;