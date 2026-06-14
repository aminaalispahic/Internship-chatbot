import { useState, useEffect } from "react";
import { ArrowRight, MessageSquare, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

export default function Chatbot() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/chat/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch (e: any) {
        setError(e.response?.data?.error || "Greška pri učitavanju pitanja.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleNext() {
    const updated = [...answers];
    updated[current] = input;
    setAnswers(updated);
    setInput("");

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      submitAll(updated);
    }
  }

  async function submitAll(finalAnswers: string[]) {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/chat/submit",
        { questions, answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDone(true);
      navigate("/success");
    } catch (e: any) {
      setError(e.response?.data?.error || "Greška pri slanju odgovora.");
    }
  }

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-main">
          <div className="login-form-wrapper">
            <p className="login-subtitle">Učitavanje pitanja...</p>
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="login-container">
        <div className="login-main">
          <div className="login-form-wrapper">
            <h1 className="login-title">Hvala!</h1>
            <p className="login-subtitle">Tvoji odgovori su sačuvani. Admin će ih pregledati.</p>
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
    Pitanje {current + 1} od {questions.length}
  </p>

  {/* Progress bar */}
  <div style={{ marginTop: 16 }}>
    <div style={{
      height: 4, background: "#d4d0f5",
      borderRadius: 4, overflow: "hidden"
    }}>
      <div style={{
        height: "100%",
        width: `${((current + 1) / questions.length) * 100}%`,
        background: "#8b7cf6",
        borderRadius: 4,
        transition: "width 0.3s ease"
      }} />
    </div>
    <p style={{ fontSize: 11, color: "#8b7cf6", marginTop: 6 }}>
      {Math.round(((current + 1) / questions.length) * 100)}% završeno
    </p>
  </div>

  {/* Spacer */}
  <div style={{ flex: 1 }} />

  {/* Dugme za rezultate */}
  <button
    className="login-button"
    style={{
      marginTop: "auto",
      background: "transparent",
      border: "1px solid #c4bef0",
      color: "#6b52d4",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      padding: "10px 14px"
    }}
    onClick={() => navigate("/moji-rezultati")}
  >
    <FileText size={15} /> Moji rezultati
  </button>

  {/* Logout */}
  <button
    className="login-button"
    style={{
      marginTop: 8,
      background: "transparent",
      border: "1px solid #e8e4fb",
      color: "#6b6480",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      padding: "10px 14px"
    }}
    onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
  >
    <LogOut size={15} /> Odjavi se
  </button>
</div>


      <div className="login-main">
        <div className="login-form-wrapper">
          <div className="login-tag">PITANJE {current + 1}/{questions.length}</div>
          <h1 className="login-title">{questions[current]}</h1>

          <div className="login-field">
            <textarea
              className="login-input"
              style={{ minHeight: 100, paddingLeft: 14, resize: "vertical" }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tvoj odgovor..."
            />
          </div>

          <button className="login-button" onClick={handleNext} disabled={!input.trim()}>
            {current + 1 < questions.length ? "Dalje" : "Završi"} <ArrowRight size={16} />
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}