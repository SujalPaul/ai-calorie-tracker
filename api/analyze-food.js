export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }

  try {

    const { foodName } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${process.env.GROQ_API_KEY}`
        },

        body: JSON.stringify({

          model: "gemma2-9b-it",

          messages: [

            {
              role: "system",

              content:
                "You are a nutrition assistant. Return ONLY valid JSON."
            },

            {
              role: "user",

              content:
`
Give nutrition facts for ${foodName}

Format EXACTLY like this:

{
  "name": "Food Name",
  "calories": 500,
  "protein": 20,
  "carbs": 50,
  "fat": 10
}
`
            }

          ],

          temperature: 0.2

        })

      }
    );

    const data = await response.json();

    console.log(data);

    const content =
      data.choices?.[0]?.message?.content;

    if (!content) {

      return res.status(500).json({
        error: "No response from AI"
      });

    }

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let nutrition;

    try {

      nutrition = JSON.parse(cleaned);

    } catch {

      return res.status(500).json({
        error: "Invalid AI response"
      });

    }

    res.status(200).json(nutrition);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message
    });

  }

}
