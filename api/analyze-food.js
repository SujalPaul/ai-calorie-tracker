export default async function handler(req, res) {

    try {

        const GEMINI_API_KEY =
        process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {

            return res.status(500).json({

                success: false,

                error:
                "Missing Gemini API key"
            });
        }

        const { image, description } =
        req.body;

        if (!image) {

            return res.status(400).json({

                success: false,

                error:
                "No image provided"
            });
        }

        const prompt = `

        Analyze this food image.

        Return ONLY valid JSON.

        Format:

        {
          "food": "food name",
          "calories": 450,
          "protein": 20,
          "carbs": 40,
          "fat": 15
        }

        Food description:
        ${description || "No description"}
        `;

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    contents: [

                        {
                            parts: [

                                {
                                    text: prompt
                                },

                                {
                                    inline_data: {

                                        mime_type:
                                        "image/jpeg",

                                        data: image
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

        if (data.error) {

            return res.status(500).json({

                success: false,

                error:
                data.error.message
            });
        }

        const text =
        data.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

        if (!text) {

            return res.status(500).json({

                success: false,

                error:
                "No AI response"
            });
        }

        const cleaned =
        text.replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const nutrition =
        JSON.parse(cleaned);

        return res.status(200).json({

            success: true,

            result: nutrition
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            error:
            error.message
        });
    }
}
