import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, MessageSquare, ShieldCheck, Lock as LockIcon2, MailCheck } from "lucide-react";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const { step, error, submitCredentials, submitOTP } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  if (step === "otp") {
    return (
      <div className="login-container">
        <div className="login-main">
          <div className="login-form-wrapper">
            <h2 className="login-title">Unesi OTP kod</h2>
            <p className="login-subtitle">Poslali smo 6-cifreni kod na tvoj email.</p>
            <div className="login-field">
              <input
                className="login-input"
                style={{ paddingLeft: 14, textAlign: "center", letterSpacing: 4 }}
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
              />
            </div>
            <button className="login-button" onClick={() => submitOTP(otp)}>
              Potvrdi
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
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
            <LockIcon2 className="sidebar-feature-icon" />
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
          <div className="login-tag">PRIJAVA</div>
          <h1 className="login-title">Dobrodošli nazad</h1>
          <p className="login-subtitle">Unesite vaše podatke za pristup nalogu</p>

          <div className="login-field">
            <label className="login-label">Email adresa</label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon" />
              <input
                className="login-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button className="login-button" onClick={() => submitCredentials(email, password)}>
            Prijavi se <ArrowRight size={16} />
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <p className="login-switch">
            Nemaš nalog? <Link to="/registracija">Registruj se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}