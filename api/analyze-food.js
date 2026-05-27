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
        error: "Food is required",
      });
    }

    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },

        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content:
                "You are a nutrition expert.",
            },

            {
              role: "user",
              content: `
Give nutrition info for ${food}.

ONLY return valid JSON.

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
          ],

          temperature: 0.2,
        }),
      }
    );

    const groqData = await groqResponse.json();

    console.log(groqData);

    const message =
      groqData.choices?.[0]?.message?.content;

    if (!message) {

      return res.status(500).json({
        error: JSON.stringify(groqData),
      });
    }

    const cleaned = message
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let nutrition;

    try {

      nutrition = JSON.parse(cleaned);

    } catch {

      nutrition = {
        name: food,
        calories: 300,
        protein: 10,
        carbs: 40,
        fat: 8,
      };
    }

    return res.status(200).json(nutrition);

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}
