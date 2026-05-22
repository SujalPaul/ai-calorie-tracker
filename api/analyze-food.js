export default async function handler(req, res) {

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
              role: "user",

              content:
`
Give nutrition facts for ${foodName}.

Reply ONLY in this format:

name: food
calories: number
protein: number
carbs: number
fat: number
`
            }

          ]

        })

      }
    );

    const data = await response.json();

    console.log(data);

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {

      return res.status(500).json({
        error: "No response from AI"
      });

    }

    const calories =
      content.match(/calories:\s*(\d+)/i)?.[1] || 0;

    const protein =
      content.match(/protein:\s*(\d+)/i)?.[1] || 0;

    const carbs =
      content.match(/carbs:\s*(\d+)/i)?.[1] || 0;

    const fat =
      content.match(/fat:\s*(\d+)/i)?.[1] || 0;

    res.status(200).json({

      name: foodName,

      calories,

      protein,

      carbs,

      fat

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Failed to analyze food"
    });

  }

}
