import User from "../models/User.js";
import Movie from "../models/Movie.js";

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// Strip ```json ... ``` fences in case the model wraps the output in markdown
const stripCodeFences = (text) => {
  const t = text.trim();
  const fence = t.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fence ? fence[1].trim() : t;
};

// POST /api/ai/recommend
export const getRecommendations = async (req, res) => {
  try {
    if (!GROQ_KEY) {
      return res.status(500).json({ message: "Groq API key is not configured" });
    }

    const user = await User.findById(req.user._id).populate("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const watchlist = user.watchlist || [];
    const watchlistTitles = watchlist.map((m) => m.title);
    const userInput = (req.body.userInput || "").trim();

    // Derive favourite genres from the user's watchlist
    const genreCount = {};
    watchlist.forEach((movie) => {
      String(movie.genre || "")
        .split("/")
        .map((g) => g.trim())
        .forEach((g) => {
          if (g) genreCount[g] = (genreCount[g] || 0) + 1;
        });
    });
    const favouriteGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);

    // Candidate pool: movies the user hasn't already watched/saved
    const allMovies = await Movie.find().lean();
    const candidates = allMovies.filter((m) => !watchlistTitles.includes(m.title));

    const candidateText = candidates.length
      ? candidates.map((m) => `- ${m.title} (${m.genre || "Unknown genre"}, ${m.year || "?"})`).join("\n")
      : "None available";

    const prompt = `Based on this user's watchlist and favourite genres, recommend 3 movies from our database they would enjoy, with reasons.
Watchlist: ${watchlistTitles.join(", ") || "empty"}
Favourite genres: ${favouriteGenres.join(", ") || "none"}
Movies available in the database (pick from these only):
${candidateText}
${userInput ? `The user is specifically asking: "${userInput}"` : ""}

Return ONLY valid JSON, no markdown, no code fences, in this exact shape:
[{"title":"Movie Title","reason":"why this user would enjoy it"}]`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText.slice(0, 300));
      return res.status(502).json({
        message: "Groq API error",
        error: errText.slice(0, 300),
      });
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(stripCodeFences(text));

    const byTitle = new Map(candidates.map((m) => [m.title, m]));
    const recommendations = (Array.isArray(parsed) ? parsed : [])
      .filter((r) => r && r.title)
      .map((r) => ({ movie: byTitle.get(r.title) || null, reason: r.reason || "" }))
      .filter((r) => r.movie);

    return res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Recommendation error:", error);
    return res.status(500).json({
      message: "Failed to generate recommendations",
      error: error.message,
    });
  }
};
