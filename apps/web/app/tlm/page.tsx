import type { Metadata } from "next";
import "../styles/tlm.css";

export const dynamic = "force-dynamic"; // la hora debe calcularse en cada request

export const metadata: Metadata = {
  title: "TLM App - Black Polar",
};

export default function TlmPage() {
  return (
    <>
<nav className="navbar">
        <div className="container">
            <div className="navbar-brand">
                <h1>🚀 TLM App</h1>
            </div>
            <ul className="nav-menu">
                <li><a href="/">Home</a></li>
                <li><a href="/services">Services</a></li>
                <li><a href="/api/v1">API</a></li>
            </ul>
        </div>
    </nav>

    <main className="container">
        <section className="hero">
            <h1>Total Learning Management</h1>
            <p>Aplicación TLM ejecutándose en puerto 5000</p>
        </section>

        <section className="info-card">
            <h2>📚 Estado de la Aplicación</h2>
            <div className="status-grid">
                <div className="status-item">
                    <h3>Puerto</h3>
                    <p>5000</p>
                </div>
                <div className="status-item">
                    <h3>Ambiente</h3>
                    <p>{process.env.NODE_ENV || "development"}</p>
                </div>
                <div className="status-item">
                    <h3>Hora</h3>
                    <p>{new Date().toLocaleTimeString("es-ES")}</p>
                </div>
            </div>
        </section>

        <section className="info-card">
            <h2>🎓 Servicios Disponibles</h2>
            <ul className="endpoint-list">
                <li>
                    <strong>Cursos</strong><br />
                    <small>Gestión de cursos y contenido educativo</small>
                </li>
                <li>
                    <strong>Usuarios</strong><br />
                    <small>Gestión de estudiantes y profesores</small>
                </li>
                <li>
                    <strong>Analítica</strong><br />
                    <small>Seguimiento de progreso y reportes</small>
                </li>
            </ul>
        </section>

        <section className="info-card">
            <h2>🔗 Endpoints Disponibles</h2>
            <ul className="endpoint-list">
                <li><code>GET /</code> - Esta página</li>
                <li><code>GET /health</code> - Health check</li>
                <li><code>GET /api/v1</code> - API v1</li>
                <li><code>GET /services</code> - Servicios disponibles</li>
            </ul>
        </section>

        <section className="info-card">
            <h2>🌐 Navega a Otras Apps</h2>
            <ul className="app-links">
                <li>
                    <strong>App Principal</strong><br />
                    <a href="/">blackpolar.org</a>
                </li>
                <li>
                    <strong>Portfolios</strong><br />
                    <a href="/portfolios">blackpolar.org/portfolios</a>
                </li>
            </ul>
        </section>
    </main>

    <footer className="footer">
        <p>&copy; 2024 Black Polar. Todos los derechos reservados.</p>
    </footer>
    </>
  );
}
