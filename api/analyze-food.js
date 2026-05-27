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
        error: "Food name required",
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
                "You are a nutrition expert. Always respond ONLY with valid JSON.",
            },

            {
              role: "user",
              content: `
Give nutrition data for ${food}.

Return ONLY valid JSON.

Example:

{
  "name": "Pizza",
  "calories": 300,
  "protein": 12,
  "carbs": 33,
  "fat": 10
}
              `,
            },
          ],

          temperature: 0.3,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        error: "No AI response",
      });
    }

    let cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const nutrition = JSON.parse(cleaned);

    return res.status(200).json(nutrition);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
