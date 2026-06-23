import "./styles/main.css";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: "40px",
        background: "#080808",
        color: "#f5f5f0",
      }}
    >
      <p
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(245,245,240,0.3)",
          marginBottom: "16px",
        }}
      >
        Error 404
      </p>

      <h1
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(4rem,12vw,10rem)",
          lineHeight: 0.9,
          marginBottom: "24px",
        }}
      >
        Not Found
      </h1>

      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "0.95rem",
          color: "rgba(245,245,240,0.45)",
          maxWidth: "420px",
          marginBottom: "40px",
        }}
      >
        La página que buscas no existe.
      </p>

      <a
        href="/"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#080808",
          background: "#f5f5f0",
          padding: "14px 32px",
          textDecoration: "none",
        }}
      >
        ← Back to Home
      </a>
    </div>
  );
}
