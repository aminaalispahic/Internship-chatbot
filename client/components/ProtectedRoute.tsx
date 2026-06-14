import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react/jsx-runtime";

interface TokenPayload {
  korisnikId: string;
  role: string;
}

function getRole(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export function RequireAuth({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  return children;
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const role = getRole();
  if (!role) return <Navigate to="/login" />;
  if (role !== "ADMIN") return <Navigate to="/chatbot" />;
  return children;
}

export function RequireUser({ children }: { children: JSX.Element }) {
  const role = getRole();
  if (!role) return <Navigate to="/login" />;
  if (role === "ADMIN") return <Navigate to="/admin" />;
  return children;
}