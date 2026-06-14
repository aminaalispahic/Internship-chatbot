import { Request, Response } from "express";
import { prisma } from "../prisma";
import { generateQuestions, evaluateAnswers } from "../services/aiService";
import { generatePDF } from "../services/pdfService";
import { checkAndIncrementUsage } from "../services/rateLimitService";

export async function getQuestions(req: Request, res: Response) {
  const dozvoljeno = await checkAndIncrementUsage();
  if (!dozvoljeno) {
    return res.status(503).json({
      error: "Chatbot je trenutno nedostupan (dnevni limit dostignut). Pokušaj sutra.",
    });
  }

  try {
    const questions = await generateQuestions();
    res.json({ questions });
  } catch (e: any) {
    if (e.status === 429) {
      return res.status(503).json({
        error: "Chatbot je trenutno nedostupan (dnevni limit dostignut). Pokušaj sutra.",
      });
    }
    console.error("getQuestions error:", e);
    res.status(500).json({ error: "Greška pri generisanju pitanja." });
  }
}

export async function submitAnswers(req: Request, res: Response) {
  const dozvoljeno = await checkAndIncrementUsage();
  if (!dozvoljeno) {
    return res.status(503).json({
      error: "Chatbot je trenutno nedostupan (dnevni limit dostignut). Pokušaj sutra.",
    });
  }

  const { questions, answers } = req.body;
  const korisnikId = (req as any).korisnikId;

  try {
    const korisnik = await prisma.korisnik.findUnique({ where: { id: korisnikId } });
    if (!korisnik) return res.status(404).json({ error: "Korisnik ne postoji." });

    const ocjena = await evaluateAnswers(questions, answers);
    const pdfBuffer = await generatePDF(korisnik, questions, answers, ocjena);

    await prisma.chatRezultat.create({
      data: { korisnikId, pdf: new Uint8Array(pdfBuffer) },
    });

    res.json({ message: "Rezultati sačuvani." });
  } catch (e: any) {
    if (e.status === 429) {
      return res.status(503).json({
        error: "Chatbot je trenutno nedostupan (dnevni limit dostignut). Pokušaj sutra.",
      });
    }
    console.error("submitAnswers error:", e);
    res.status(500).json({ error: "Greška pri obradi odgovora." });
  }
}

export async function listResults(req: Request, res: Response) {
  const rezultati = await prisma.chatRezultat.findMany({
    include: { korisnik: { select: { ime: true, prezime: true, email: true } } },
    orderBy: { kreiranAt: "desc" },
  });

  res.json(
    rezultati.map((r) => ({
      id: r.id,
      ime: r.korisnik.ime,
      prezime: r.korisnik.prezime,
      email: r.korisnik.email,
      kreiranAt: r.kreiranAt,
    }))
  );
}

export async function downloadResult(req: Request, res: Response) {
  const id = req.params.id as string;
  const rezultat = await prisma.chatRezultat.findUnique({ where: { id } });
  if (!rezultat) return res.status(404).json({ error: "Nije pronađeno." });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="rezultat-${id}.pdf"`);
  res.send(rezultat.pdf);
}
export async function myResults(req: Request, res: Response) {
  const korisnikId = (req as any).korisnikId;

  try {
    const rezultati = await prisma.chatRezultat.findMany({
      where: { korisnikId },
      orderBy: { kreiranAt: "desc" },
      select: {
        id: true,
        kreiranAt: true,
        adminKomentar: true,
      },
    });

    res.json(rezultati);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Greška." });
  }
}