import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { food } = req.body;

    if (!food) {
      return res.status(400).json({ error: "Food description required" });
    }

    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1"
    });

    const prompt = `
A user uploaded an image of food and described it as: "${food}".

Estimate:
- Calories
- Protein
- Carbs
- Fat

Give a clean, short answer.
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    res.status(200).json({
      result: response.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
