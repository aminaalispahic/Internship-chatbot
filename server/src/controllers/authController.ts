import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../prisma";
import { decryptRSA } from "../services/rsaService";
import { generateOTP, isOTPExpired } from "../utils/otp";
import { sendOTPEmail } from "../services/emailService";

// ─── REGISTRACIJA ────────────────────────────────────────────
export async function register(req: Request, res: Response) {
  const { ime, prezime, email, lozinka, datumRodjenja } = req.body;
  // lozinka stiže enkriptovana RSA-om

  const exists = await prisma.korisnik.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: "Email već postoji." });

  // 1. RSA dekriptovanje
  let lozinkaPlain: string;
  try {
    lozinkaPlain = decryptRSA(lozinka);
  } catch {
    return res.status(400).json({ error: "Nevažeća enkripcija lozinke." });
  }

  // 2. bcrypt hashovanje
  const hashed = await bcrypt.hash(lozinkaPlain, 10);

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.korisnik.create({
    data: {
      ime,
      prezime,
      email,
      lozinka: hashed,
      datumRodjenja: new Date(datumRodjenja),
      otpCode: otp,
      otpExpiresAt,
    },
  });

  await sendOTPEmail(email, otp);
  res.json({ message: "Registracija uspješna. Provjeri email za OTP kod." });
}

// ─── VERIFIKACIJA EMAILA ─────────────────────────────────────
export async function verifyEmail(req: Request, res: Response) {
  const { email, otp } = req.body;

  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik) return res.status(404).json({ error: "Korisnik ne postoji." });
  if (korisnik.otpCode !== otp) return res.status(400).json({ error: "Pogrešan OTP." });
  if (isOTPExpired(korisnik.otpExpiresAt!)) return res.status(400).json({ error: "OTP je istekao." });

  await prisma.korisnik.update({
    where: { email },
    data: { isVerified: true, otpCode: null, otpExpiresAt: null },
  });

  const token = jwt.sign({ korisnikId: korisnik.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
  res.json({ token });
}

// ─── LOGIN ───────────────────────────────────────────────────
export async function login(req: Request, res: Response) {
  const { email, lozinka } = req.body;
  // lozinka stiže enkriptovana RSA-om

  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik || !korisnik.isVerified)
    return res.status(401).json({ error: "Pogrešni kredencijali ili nalog nije verifikovan." });

  // 1. RSA dekriptovanje
  let lozinkaPlain: string;
  try {
    lozinkaPlain = decryptRSA(lozinka);
  } catch {
    return res.status(400).json({ error: "Nevažeća enkripcija lozinke." });
  }

  // 2. Provjera bcrypt hasha
  const valid = await bcrypt.compare(lozinkaPlain, korisnik.lozinka);
  if (!valid) return res.status(401).json({ error: "Pogrešna lozinka." });

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.korisnik.update({
    where: { email },
    data: { otpCode: otp, otpExpiresAt },
  });

  await sendOTPEmail(email, otp);
  res.json({ message: "OTP poslan na email." });
}

// ─── VERIFIKACIJA 2FA ─────────────────────────────────────────
export async function verify2FA(req: Request, res: Response) {
  const { email, otp } = req.body;

  const korisnik = await prisma.korisnik.findUnique({ where: { email } });
  if (!korisnik) return res.status(404).json({ error: "Korisnik ne postoji." });
  if (korisnik.otpCode !== otp) return res.status(400).json({ error: "Pogrešan OTP." });
  if (isOTPExpired(korisnik.otpExpiresAt!)) return res.status(400).json({ error: "OTP je istekao." });

  await prisma.korisnik.update({
    where: { email },
    data: { otpCode: null, otpExpiresAt: null },
  });

 const token = jwt.sign(
  { korisnikId: korisnik.id, role: korisnik.role },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);

  res.json({
    token,
    korisnik: {
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      email: korisnik.email,
      datumRodjenja: korisnik.datumRodjenja,
    },
  });
}