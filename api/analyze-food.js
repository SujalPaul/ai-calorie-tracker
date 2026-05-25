export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { food, image } = req.body;

        const GEMINI_API_KEY =
        process.env.GEMINI_API_KEY;

        let parts = [];

        /* IMAGE MODE */

        if (image) {

            parts = [

                {
                    text: `
                    Identify the food in this image.

                    Return ONLY valid JSON.

                    Example:

                    {
                      "name": "Pizza",
                      "calories": 300,
                      "protein": 12,
                      "carbs": 35,
                      "fat": 10
                    }
                    `
                },

                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: image
                    }
                }
            ];
        }

        /* TEXT MODE */

        else {

            parts = [

                {
                    text: `
                    Analyze this food:

                    ${food}

                    Return ONLY valid JSON.

                    Example:

                    {
                      "name": "Burger",
                      "calories": 450,
                      "protein": 20,
                      "carbs": 40,
                      "fat": 18
                    }
                    `
                }
            ];
        }

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,

            {

                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    contents: [
                        {
                            parts
                        }
                    ]
                })
            }
        );

        const data =
        await response.json();

        console.log(data);

        const text =
        data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

        if (!text) {

            return res.status(500).json({
                error: "No AI response"
            });
        }

        /* CLEAN JSON */

        const cleanText =
        text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        let nutrition;

        try {

            nutrition =
            JSON.parse(cleanText);

        }

        catch {

            return res.status(500).json({
                error:
                "AI returned invalid JSON",
                raw: cleanText
            });
        }

        res.status(200).json(nutrition);

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            error: "AI analysis failed"
        });
    }
}
