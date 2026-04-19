import OpenAI from "openai";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Identify this food and estimate calories, protein, carbs and fat."
            },
            {
              type: "input_image",
              image_url: image   // ✅ IMPORTANT: direct base64 here
            }
          ]
        }
      ]
    });

    res.status(200).json({
      result: response.output_text
    });

  } catch (error) {

    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: error.message
    });

  }

}
