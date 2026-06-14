import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { encryptRSA } from "../../server/src/utils/rsa";

type Step = "credentials" | "otp";

export function useLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function submitCredentials(email: string, password: string) {
    try {
      const lozinkaEnkriptovana = await encryptRSA(password);
      await axios.post("/api/auth/login", { email, lozinka: lozinkaEnkriptovana });
      setEmail(email);
      setStep("otp");
    } catch (e: any) {
      setError(e.response?.data?.error || "Greška.");
    }
  }

  async function submitOTP(otp: string) {
    try {
      const { data } = await axios.post("/api/auth/verify-2fa", { email, otp });
      localStorage.setItem("token", data.token);
      navigate("/chatbot");
    } catch (e: any) {
      setError(e.response?.data?.error || "Pogrešan OTP.");
    }
  }

  return { step, error, submitCredentials, submitOTP };
}