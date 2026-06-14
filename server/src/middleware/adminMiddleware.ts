import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Nema tokena." });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { korisnikId: string };

    const korisnik = await prisma.korisnik.findUnique({
      where: { id: decoded.korisnikId },
    });

    if (!korisnik) return res.status(401).json({ error: "Korisnik ne postoji." });
    if (korisnik.role !== "ADMIN") return res.status(403).json({ error: "Nemate pristup." });

    (req as any).korisnikId = korisnik.id;
    next();
  } catch {
    return res.status(401).json({ error: "Nevažeći token." });
  }
}