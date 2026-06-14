import { useNavigate } from "react-router-dom";
import { LogOut, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Rezultat {
  id: string;
  ime: string;
  prezime: string;
  email: string;
  kreiranAt: string;
  adminKomentar: string | null;
}

export default function AdminPanel() {
  const [rezultati, setRezultati] = useState<Rezultat[]>([]);
  const [error, setError] = useState("");
  const [komentari, setKomentari] = useState<Record<string, string>>({});
const [saved, setSaved] = useState<string | null>(null);
const navigate = useNavigate();
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/admin/rezultati", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRezultati(data);
        const existing: Record<string, string> = {};
data.forEach((r: Rezultat) => {
  if (r.adminKomentar) existing[r.id] = r.adminKomentar;
});
setKomentari(existing);
      } catch (e: any) {
        setError(e.response?.data?.error || "Nemaš pristup.");
      }
    }
    load();
  }, []);

 async function download(id: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`/api/admin/rezultati/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    // Kreiraj link i automatski klikni
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rezultat-${id}.pdf`; // ← skida fajl umjesto otvaranja
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // oslobodi memoriju
  } catch (e: any) {
    setError(e.response?.data?.error || "Greška pri preuzimanju PDF-a.");
  }
}
async function saveKomentar(id: string) {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `/api/admin/rezultati/${id}/komentar`,
      { komentar: komentari[id] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  } catch {
    setError("Greška pri čuvanju komentara.");
  }
}
  if (error) {
    return (
      <div className="login-container">
        <div className="login-main">
          <div className="login-form-wrapper">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div style={{ minHeight: "100vh", background: "#fafafd" }}>
    {/* Navbar */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 32px", background: "#fff",
      borderBottom: "1px solid #e8e4fb", marginBottom: 32
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
          <MessageSquare size={18} />
        </div>
        <span style={{ fontWeight: 600, fontSize: 16, color: "#2d2a3d" }}>
          Internship Chatbot
        </span>
        <span style={{
          marginLeft: 8, fontSize: 11, fontWeight: 700,
          background: "#f0eefc", color: "#8b7cf6",
          padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em"
        }}>ADMIN</span>
      </div>
      <button
        className="login-button"
        style={{ width: "auto", padding: "8px 16px" }}
        onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
      >
        <LogOut size={15} /> Odjavi se
      </button>
    </div>

    <div style={{ padding: "0 32px 32px" }}>
      <h1 className="login-title">Rezultati kandidata</h1>
      <p className="login-subtitle" style={{ marginBottom: 24 }}>
        Pregledajte odgovore i AI ocjene svih kandidata
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e8e4fb" }}>
        <thead>
          <tr style={{ background: "#f8f7ff" }}>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#8b7cf6", letterSpacing: "0.05em" }}>KANDIDAT</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#8b7cf6", letterSpacing: "0.05em" }}>EMAIL</th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#8b7cf6", letterSpacing: "0.05em" }}>DATUM</th>
            <th style={{ padding: "12px 16px" }}></th>
            <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#8b7cf6", letterSpacing: "0.05em" }}>KOMENTAR</th>
          </tr>
        </thead>
        <tbody>
  {rezultati.map((r, i) => (
    <tr key={r.id} style={{ borderTop: "1px solid #f0eefc", background: i % 2 === 0 ? "#fff" : "#fafafd" }}>
      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 500, color: "#2d2a3d" }}>
        {r.ime} {r.prezime}
      </td>
      <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b6480" }}>
        {r.email}
      </td>
      <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b6480" }}>
        {new Date(r.kreiranAt).toLocaleString("bs-BA")}
      </td>
      {/* Komentar kolona */}
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            style={{
              width: 220, padding: "7px 12px", fontSize: 13,
              border: "1px solid #e8e4fb", borderRadius: 8,
              background: "#fff", color: "#2d2a3d", outline: "none"
            }}
            placeholder="Dodaj komentar..."
            value={komentari[r.id] || ""}
            onChange={(e) => setKomentari({ ...komentari, [r.id]: e.target.value })}
          />
          <button
            className="login-button"
            style={{ width: "auto", padding: "7px 14px", fontSize: 13 }}
            onClick={() => saveKomentar(r.id)}
          >
            {saved === r.id ? "✓" : "Pošalji"}
          </button>
        </div>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <button
          className="login-button"
          style={{ width: "auto", padding: "7px 16px", fontSize: 13 }}
          onClick={() => download(r.id)}
        >
          Pregledaj PDF
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  </div>
);}