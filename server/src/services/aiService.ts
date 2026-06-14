import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL = "llama-3.3-70b-versatile";

export async function generateQuestions(): Promise<string[]> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Generiši 5 pitanja za intervju za studentsku praksu (internship).
Pitanja treba da pokrivaju: motivaciju, vještine, dostupnost, prethodno iskustvo i ciljeve.
Vrati ISKLJUČIVO JSON niz stringova, bez ikakvog drugog teksta, npr:
["Pitanje 1?", "Pitanje 2?", ...]`,
      },
    ],
  });

  const text = completion.choices[0]?.message?.content || "[]";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function evaluateAnswers(
  questions: string[],
  answers: string[]
): Promise<string> {
  const qa = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join("\n\n");

  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "user",
        content: `Na osnovu sljedećih odgovora kandidata za studentsku praksu, napiši kratku ocjenu/sažetak (3-5 rečenica) za HR/admina o tome koliko je kandidat pripremljen i pogodan.\n\n${qa}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content || "";
}