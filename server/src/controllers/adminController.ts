import { Request, Response } from "express";
import { prisma } from "../prisma";

export async function addKomentar(req: Request, res: Response) {
  const id = req.params.id as string;
  const { komentar } = req.body;

  try {
    const rezultat = await prisma.chatRezultat.findUnique({ where: { id } });
    if (!rezultat) return res.status(404).json({ error: "Rezultat nije pronađen." });

    await prisma.chatRezultat.update({
      where: { id },
      data: { adminKomentar: komentar },
    });

    res.json({ message: "Komentar sačuvan." });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Greška pri čuvanju komentara." });
  }
}

export async function listResults(req: Request, res: Response) {
  try {
    const rezultati = await prisma.chatRezultat.findMany({
      include: { korisnik: { select: { ime: true, prezime: true, email: true } } },
      orderBy: { kreiranAt: "desc" },
    });

    res.json(rezultati.map((r) => ({
      id: r.id,
      ime: r.korisnik.ime,
      prezime: r.korisnik.prezime,
      email: r.korisnik.email,
      kreiranAt: r.kreiranAt,
      adminKomentar: r.adminKomentar ?? null,
    })));
  } catch (e) {
    res.status(500).json({ error: "Greška." });
  }
}

export async function downloadResult(req: Request, res: Response) {
  const id = req.params.id as string;
  try {
    const rezultat = await prisma.chatRezultat.findUnique({ where: { id } });
    if (!rezultat) return res.status(404).json({ error: "Nije pronađeno." });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="rezultat-${id}.pdf"`);
    res.send(rezultat.pdf);
  } catch (e) {
    res.status(500).json({ error: "Greška." });
  }
}