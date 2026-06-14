import { useNavigate } from "react-router-dom";
import { CheckCircle, LogOut, MessageSquare } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <MessageSquare size={20} />
          </div>
          <span className="sidebar-logo-text">Internship Chatbot</span>
        </div>
        <p className="sidebar-description">
          Tvoj asistent za pronalazak prakse i razvoj karijere.
        </p>
      </div>

      <div className="login-main">
        <div className="login-form-wrapper" style={{ textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#f0faf4", display: "flex",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px"
          }}>
            <CheckCircle size={36} color="#1D9E75" />
          </div>

          <div className="login-tag" style={{ textAlign: "center" }}>ZAVRŠENO</div>
          <h1 className="login-title" style={{ textAlign: "center" }}>Hvala ti!</h1>
          <p className="login-subtitle" style={{ textAlign: "center" }}>
            Tvoji odgovori su uspješno sačuvani.<br />
            Admin će pregledati tvoje rezultate i kontaktirati te.
          </p>

          <div style={{
            background: "#f8f7ff", border: "1px solid #e8e4fb",
            borderRadius: 12, padding: "16px 20px",
            marginBottom: 24, textAlign: "left"
          }}>
            <p style={{ fontSize: 13, color: "#6b6480", lineHeight: 1.6 }}>
              📋 Rezultati su proslijeđeni timu za odabir kandidata.<br />
              📧 Očekuj povratnu informaciju na tvoj email.<br />
              ⏱️ Rok odgovora je obično 3–5 radnih dana.
            </p>
          </div>

          <button className="login-button" onClick={logout}>
            <LogOut size={16} /> Odjavi se
          </button>
          <button
  className="login-button"
  style={{ width: "auto", padding: "10px 20px", marginTop: 12 }}
  onClick={() => navigate("/moji-rezultati")}
>
  Pogledaj moje rezultate
</button>
        </div>
      </div>
    </div>
  );
}