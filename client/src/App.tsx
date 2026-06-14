import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Registracija from "../pages/Registration";
import Chatbot from "../pages/Chatbot";
import AdminPanel from "../pages/AdminPanel";
import Success from "../pages/Success";
import MojiRezultati from "../pages/MojiRezultati";
import { RequireAdmin, RequireUser } from "../components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registracija" element={<Registracija />} />

        <Route path="/chatbot" element={
          <RequireUser><Chatbot /></RequireUser>
        } />
        <Route path="/success" element={
          <RequireUser><Success /></RequireUser>
        } />
        <Route path="/moji-rezultati" element={
          <RequireUser><MojiRezultati /></RequireUser>
        } />

        <Route path="/admin" element={
          <RequireAdmin><AdminPanel /></RequireAdmin>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;