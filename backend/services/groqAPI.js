import "dotenv/config";

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const interaction = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: "Explain how AI works in a few words" }],
    }),
  }
);

const data = await interaction.json();
console.log(data.choices[0].message.content);
