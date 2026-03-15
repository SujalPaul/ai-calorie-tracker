<<<<<<< HEAD
import OpenAI from "openai";

=======

import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: true
  }
};

>>>>>>> c9707c789c483c749bba2da48476f916c5cccc01
export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    const { image } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
<<<<<<< HEAD
              text: "Identify the food and estimate calories, protein, carbs, and fat."
=======
              text: "Identify the food in this image and estimate calories, protein, carbs, and fat. Return short answer."
>>>>>>> c9707c789c483c749bba2da48476f916c5cccc01
            },
            {
              type: "image_url",
              image_url: image
            }
          ]
        }
      ]
    });

    res.status(200).json({
      result: response.choices[0].message.content
    });

  } catch (error) {

<<<<<<< HEAD
=======
    console.error(error);

>>>>>>> c9707c789c483c749bba2da48476f916c5cccc01
    res.status(500).json({
      error: "Food analysis failed"
    });

  }

}
