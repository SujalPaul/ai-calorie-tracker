import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Identify this food and estimate calories, protein, carbs and fat." },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ]
    });

    res.status(200).json({
      result: completion.choices[0].message.content
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "AI analysis failed"
    });

  }

}
