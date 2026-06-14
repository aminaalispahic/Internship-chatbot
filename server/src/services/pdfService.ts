import PDFDocument from "pdfkit";
import path from "path";

const FONT = path.join(process.cwd(), "fonts/DejaVuSans.ttf");
const FONT_BOLD = path.join(process.cwd(), "fonts/DejaVuSans-Bold.ttf");
const PURPLE = "#8b7cf6";
const DARK = "#2d2a3d";
const GRAY = "#6b6480";
const LIGHT = "#f8f7ff";
const BORDER = "#e8e4fb";

export async function generatePDF(
  korisnik: { ime: string; prezime: string; email: string },
  questions: string[],
  answers: string[],
  ocjena: string
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 48, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Registruj fontove
    doc.registerFont("Regular", FONT);
    doc.registerFont("Bold", FONT_BOLD);

    const pageWidth = doc.page.width - 96; // minus margine

    // ─── HEADER ──────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill(LIGHT);

    doc.font("Bold").fontSize(18).fillColor(DARK)
      .text("Internship Chatbot", 48, 24);
    doc.font("Regular").fontSize(11).fillColor(GRAY)
      .text("Rezultati intervjua za praksu", 48, 46);

    // Linija ispod headera
    doc.moveTo(0, 80).lineTo(doc.page.width, 80)
      .strokeColor(BORDER).lineWidth(1).stroke();

    doc.moveDown(3);

    // ─── META KARTICA ─────────────────────────────────────────
    const metaY = 104;
    doc.rect(48, metaY, pageWidth, 72)
      .fillAndStroke(LIGHT, BORDER);

    // Kandidat
    doc.font("Bold").fontSize(9).fillColor(PURPLE)
      .text("KANDIDAT", 64, metaY + 12);
    doc.font("Regular").fontSize(12).fillColor(DARK)
      .text(`${korisnik.ime} ${korisnik.prezime}`, 64, metaY + 26);

    // Email
    doc.font("Bold").fontSize(9).fillColor(PURPLE)
      .text("EMAIL", 64 + pageWidth / 3, metaY + 12);
    doc.font("Regular").fontSize(12).fillColor(DARK)
      .text(korisnik.email, 64 + pageWidth / 3, metaY + 26);

    // Datum
    doc.font("Bold").fontSize(9).fillColor(PURPLE)
      .text("DATUM", 64 + (pageWidth / 3) * 2, metaY + 12);
    doc.font("Regular").fontSize(12).fillColor(DARK)
      .text(new Date().toLocaleString("bs-BA"), 64 + (pageWidth / 3) * 2, metaY + 26);

    doc.y = metaY + 88;

    // ─── SECTION NASLOV ───────────────────────────────────────
    doc.font("Bold").fontSize(9).fillColor(PURPLE)
      .text("PITANJA I ODGOVORI", 48, doc.y);

    doc.moveDown(0.6);

    // ─── Q&A ITEMS ────────────────────────────────────────────
    questions.forEach((q, i) => {
      const startY = doc.y;

      // Provjeri da li ima mjesta na stranici
      if (startY > doc.page.height - 150) {
        doc.addPage();
        doc.y = 48;
      }

      // Broj pitanja — krug
      doc.circle(60, doc.y + 8, 9)
        .fillAndStroke(PURPLE, PURPLE);
      doc.font("Bold").fontSize(9).fillColor("#ffffff")
        .text(`${i + 1}`, 56, doc.y + 4, { width: 9, align: "center" });

      // Pitanje
      doc.font("Bold").fontSize(12).fillColor(DARK)
        .text(q, 76, doc.y - 4, { width: pageWidth - 28 });

      doc.moveDown(0.4);

      // Odgovor
      doc.font("Regular").fontSize(11).fillColor(GRAY)
        .text(answers[i] || "Nije odgovoreno", 76, doc.y, {
          width: pageWidth - 28,
        });

      doc.moveDown(0.3);

      // Linija između pitanja
      if (i < questions.length - 1) {
        doc.moveTo(48, doc.y).lineTo(48 + pageWidth, doc.y)
          .strokeColor(BORDER).lineWidth(0.5).stroke();
        doc.moveDown(0.6);
      }
    });

    doc.moveDown(1);

    // ─── AI OCJENA ────────────────────────────────────────────
    // Provjeri prostor
    if (doc.y > doc.page.height - 160) {
      doc.addPage();
      doc.y = 48;
    }

    const aiY = doc.y;
    const ocjenaHeight = Math.max(80, ocjena.length / 3);

    doc.rect(48, aiY, pageWidth, ocjenaHeight + 40)
      .fillAndStroke("#f0eefc", PURPLE);

    doc.circle(64, aiY + 16, 6).fill(PURPLE);

    doc.font("Bold").fontSize(9).fillColor(PURPLE)
      .text("AI OCJENA", 76, aiY + 12);

    doc.font("Regular").fontSize(11).fillColor(DARK)
      .text(ocjena, 64, aiY + 28, { width: pageWidth - 30 });

    // ─── FOOTER ───────────────────────────────────────────────
    doc.font("Regular").fontSize(9).fillColor("#b0aac0")
      .text(
        `Generisano automatski · Internship Chatbot · ${new Date().toLocaleDateString("bs-BA")}`,
        48,
        doc.page.height - 40,
        { width: pageWidth, align: "center" }
      );

    doc.end();
  });
}