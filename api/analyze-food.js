import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }

  try {

    const { food } = req.body;

    const client = new OpenAI({

      apiKey: process.env.GROQ_API_KEY,

      baseURL: "https://api.groq.com/openai/v1"

    });

    const prompt = `

Return ONLY raw JSON.

Do not explain.
Do not add markdown.
Do not add notes.

Food: ${food}

Format:

{
  "name": "food name",
  "calories": 500,
  "protein": 20,
  "carbs": 60,
  "fat": 10
}

`;

    const response =
      await client.chat.completions.create({

        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "user",
            content: prompt
          }
        ],

        temperature: 0.2

      });

    res.status(200).json({

      result:
        response.choices[0].message.content

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }

}
