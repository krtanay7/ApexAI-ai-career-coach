import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function generateText(prompt, options = {}) {
  const completion = await groq.chat.completions.create({
    model: options.model || DEFAULT_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: options.temperature ?? 0.2,
  });

  return completion.choices?.[0]?.message?.content?.trim() || "";
}
