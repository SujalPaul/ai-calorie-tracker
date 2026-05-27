export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { food } = req.body;

    if (!food) {
      return res.status(400).json({
        error: "Food name is required",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a nutrition expert. Only respond with valid JSON.",
            },
            {
              role: "user",
              content: `
Give nutrition data for ${food}.

Respond ONLY in this JSON format:

{
  "name": "food name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number
}
              `,
            },
          ],
          temperature: 0.2,
        }),
      }
    );

    const data = await response.json();

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({
        error: "No AI response",
      });
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const nutrition = JSON.parse(cleaned);

    return res.status(200).json(nutrition);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
