export default async function handler(req, res) {
  try {
    const { food } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",

          messages: [
            {
              role: "system",
              content: `
You are a nutrition AI.

Return ONLY valid JSON.

Example:
{
  "name": "Pizza",
  "calories": 300,
  "protein": 12,
  "carbs": 35,
  "fat": 10
}
              `,
            },
            {
              role: "user",
              content: `Food: ${food}`,
            },
          ],

          temperature: 0.3,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({
        error: "No response from AI",
      });
    }

    let nutrition;

    try {
      nutrition = JSON.parse(content);
    } catch {
      return res.status(500).json({
        error: "Invalid AI response",
      });
    }

    res.status(200).json(nutrition);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server error",
    });
  }
}
