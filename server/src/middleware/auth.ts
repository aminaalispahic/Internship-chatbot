import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Nedostaje token." });
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { korisnikId: string };
    (req as any).korisnikId = payload.korisnikId;
    next();
  } catch {
    res.status(401).json({ error: "Nevažeći token." });
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const korisnikId = (req as any).korisnikId;

  const korisnik = await prisma.korisnik.findUnique({ where: { id: korisnikId } });
  if (korisnik?.role !== "ADMIN") {
    return res.status(403).json({ error: "Nemaš pristup." });
  }
  next();
}