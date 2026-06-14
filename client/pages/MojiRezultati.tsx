import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, LogOut, FileText, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";

interface Rezultat {
  id: string;
  kreiranAt: string;
  adminKomentar: string | null;
}

export default function MojiRezultati() {
  const [rezultati, setRezultati] = useState<Rezultat[]>([]);
  const [otvoren, setOtvoren] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/chat/moji-rezultati", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRezultati(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function downloadPDF(id: string) {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/admin/rezultati/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `moj-rezultat-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafd" }}>
      {/* Navbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 32px", background: "#fff", borderBottom: "1px solid #e8e4fb",
        marginBottom: 32
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
            <MessageSquare size={18} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 16, color: "#2d2a3d" }}>
            Internship Chatbot
          </span>
        </div>
        <button
          className="login-button"
          style={{ width: "auto", padding: "8px 16px" }}
          onClick={logout}
        >
          <LogOut size={15} /> Odjavi se
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <button
    className="login-button"
    style={{
      width: "auto", padding: "8px 16px",
      background: "transparent",
      border: "1px solid #e8e4fb",
      color: "#6b6480"
    }}
    onClick={() => navigate("/chatbot")}
  >
    <MessageSquare size={15} /> Novi intervju
  </button>
  
</div>
      </div>

      <div style={{ padding: "0 32px 32px", maxWidth: 720, margin: "0 auto" }}>
        <div className="login-tag">MOJI REZULTATI</div>
        <h1 className="login-title">Tvoji intervjui</h1>
        <p className="login-subtitle" style={{ marginBottom: 28 }}>
          Pregled tvojih odgovora i komentara od admina
        </p>

        {loading && (
          <p style={{ color: "#6b6480" }}>Učitavanje...</p>
        )}

        {!loading && rezultati.length === 0 && (
          <div style={{
            background: "#fff", border: "1px solid #e8e4fb",
            borderRadius: 12, padding: 32, textAlign: "center"
          }}>
            <FileText size={40} color="#b0aac0" style={{ marginBottom: 12 }} />
            <p style={{ color: "#6b6480" }}>Još nemaš nijedan intervju.</p>
          </div>
        )}

        {rezultati.map((r, i) => (
          <div key={r.id} style={{
            background: "#fff", border: "1px solid #e8e4fb",
            borderRadius: 12, marginBottom: 12, overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "16px 20px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#f0eefc", display: "flex",
                  alignItems: "center", justifyContent: "center"
                }}>
                  <FileText size={16} color="#8b7cf6" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#2d2a3d" }}>
                    Intervju #{rezultati.length - i}
                  </p>
                  <p style={{ fontSize: 12, color: "#6b6480" }}>
                    {new Date(r.kreiranAt).toLocaleString("bs-BA")}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {r.adminKomentar && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#8b7cf6",
                    background: "#f0eefc", padding: "3px 10px",
                    borderRadius: 20, display: "flex", alignItems: "center", gap: 4
                  }}>
                    <MessageCircle size={12} /> Komentar
                  </span>
                )}

                <button
                  className="login-button"
                  style={{ width: "auto", padding: "6px 14px", fontSize: 13 }}
                  onClick={() => downloadPDF(r.id)}
                >
                  <FileText size={14} /> PDF
                </button>

                {r.adminKomentar && (
                  <button
                    onClick={() => setOtvoren(otvoren === r.id ? null : r.id)}
                    style={{
                      background: "none", border: "none",
                      cursor: "pointer", color: "#8b7cf6", padding: 4
                    }}
                  >
                    {otvoren === r.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                )}
              </div>
            </div>

            {/* Komentar admina */}
            {otvoren === r.id && r.adminKomentar && (
              <div style={{
                borderTop: "1px solid #f0eefc",
                padding: "16px 20px",
                background: "#f8f7ff"
              }}>
                <p style={{
                  fontSize: 11, fontWeight: 700, color: "#8b7cf6",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 6
                }}>
                  <MessageCircle size={13} /> Komentar admina
                </p>
                <p style={{ fontSize: 14, color: "#2d2a3d", lineHeight: 1.6 }}>
                  {r.adminKomentar}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}