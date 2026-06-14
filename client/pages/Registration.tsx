import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, Calendar, ArrowRight, MessageSquare, ShieldCheck, MailCheck } from "lucide-react";
import { encryptRSA } from "../../server/src/utils/rsa";
import axios from "axios";

export default function Registracija() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ime: "", prezime: "", email: "",
    lozinka: "", datumRodjenja: "",
  });
  const [korak, setKorak] = useState<"forma" | "otp">("forma");
  const [otp, setOtp] = useState("");
  const [greska, setGreska] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleRegistracija() {
    try {
      const lozinkaEnkriptovana = await encryptRSA(form.lozinka);

      await axios.post("/api/auth/register", {
        ...form,
        lozinka: lozinkaEnkriptovana,
      });

      setKorak("otp");
    } catch (e: any) {
      setGreska(e.response?.data?.error || "Greška.");
    }
  }

  async function handleVerifikacija() {
    try {
      const { data } = await axios.post("/api/auth/verify-email", {
        email: form.email,
        otp,
      });
      localStorage.setItem("token", data.token);
      navigate("/chatbot");
    } catch (e: any) {
      setGreska(e.response?.data?.error || "Pogrešan OTP.");
    }
  }

  if (korak === "otp") {
    return (
      <div className="login-container">
        <div className="login-main">
          <div className="login-form-wrapper">
            <h2 className="login-title">Verifikacija emaila</h2>
            <p className="login-subtitle">
              Unesi 6-cifreni kod poslan na <strong>{form.email}</strong>
            </p>
            <div className="login-field">
              <input
                className="login-input"
                style={{ paddingLeft: 14, textAlign: "center", letterSpacing: 4 }}
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
              />
            </div>
            <button className="login-button" onClick={handleVerifikacija}>
              Potvrdi
            </button>
            {greska && <p style={{ color: "red" }}>{greska}</p>}
          </div>
        </div>
      </div>
    );
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
        <div className="sidebar-features">
          <div className="sidebar-feature">
            <ShieldCheck className="sidebar-feature-icon" />
            Sigurna prijava
          </div>
          <div className="sidebar-feature">
            <Lock className="sidebar-feature-icon" />
            Zaštita podataka
          </div>
          <div className="sidebar-feature">
            <MailCheck className="sidebar-feature-icon" />
            Verifikacija emailom
          </div>
        </div>
      </div>

      <div className="login-main">
        <div className="login-form-wrapper">
          <div className="login-tag">REGISTRACIJA</div>
          <h1 className="login-title">Kreiraj nalog</h1>
          <p className="login-subtitle">Popunite podatke kako biste se registrovali</p>

          <div className="login-row">
            <div className="login-field">
              <label className="login-label">Ime</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" />
                <input
                  className="login-input"
                  name="ime"
                  type="text"
                  value={form.ime}
                  onChange={handleChange}
                  placeholder="Amir"
                />
              </div>
            </div>

            <div className="login-field">
              <label className="login-label">Prezime</label>
              <div className="login-input-wrapper">
                <User className="login-input-icon" />
                <input
                  className="login-input"
                  name="prezime"
                  type="text"
                  value={form.prezime}
                  onChange={handleChange}
                  placeholder="Hodžić"
                />
              </div>
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Email adresa</label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" />
              <input
                className="login-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ime@primjer.ba"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Lozinka</label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon" />
              <input
                className="login-input"
                name="lozinka"
                type="password"
                value={form.lozinka}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Datum rođenja</label>
            <div className="login-input-wrapper">
              <Calendar className="login-input-icon" />
              <input
                className="login-input"
                name="datumRodjenja"
                type="date"
                value={form.datumRodjenja}
                onChange={handleChange}
                aria-label="Datum rođenja"
              />
            </div>
          </div>

          <button className="login-button" onClick={handleRegistracija}>
            Registruj se <ArrowRight size={16} />
          </button>
          {greska && <p style={{ color: "red" }}>{greska}</p>}

          <p className="login-switch">
            Već imaš nalog? <Link to="/login">Prijavi se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}