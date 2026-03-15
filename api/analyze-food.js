import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { image } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Identify the food in this image and estimate calories, protein, carbs and fat. Respond clearly.",
            },
            {
              type: "image_url",
              image_url: { url: image },
            },
          ],
        },
      ],
    });

    res.status(200).json({
      result: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Food analysis failed." });
  }
}
