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

          model: "llama3-70b-8192",

          messages: [

            {
              role: "system",

              content:
`
You are a nutrition API.

Return ONLY valid JSON.

Example:
{
  "name": "Pizza",
  "calories": 320,
  "protein": 12,
  "carbs": 35,
  "fat": 14
}

Do not add explanations.
Do not use markdown.
Do not wrap in backticks.
`
            },

            {
              role: "user",

              content:
                `Give nutrition facts for ${foodName}`
            }

          ],

          temperature: 0.1

        })

      }
    );

    const data = await response.json();

    const text =
      data.choices[0].message.content;

    console.log(text);

    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const nutrition =
      JSON.parse(cleanText);

    res.status(200).json(nutrition);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed to analyze food"
    });

  }

}
