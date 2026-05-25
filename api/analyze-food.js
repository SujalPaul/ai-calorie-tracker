export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const {
            food,
            image
        } = req.body;

        const GEMINI_API_KEY =
        process.env.GEMINI_API_KEY;

        let parts = [];

        // IMAGE MODE

        if(image){

            parts = [

                {
                    text: `
                    Identify the food in this image.

                    Return ONLY valid JSON:

                    {
                      "name": "",
                      "calories": 0,
                      "protein": 0,
                      "carbs": 0,
                      "fat": 0
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

        // TEXT MODE

        else{

            parts = [

                {
                    text: `
                    Analyze this food:
                    ${food}

                    Return ONLY valid JSON:

                    {
                      "name": "",
                      "calories": 0,
                      "protein": 0,
                      "carbs": 0,
                      "fat": 0
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

        const text =
        data.candidates[0]
        .content.parts[0]
        .text;

        const cleanText =
        text
        .replace(/```json/g, "")
        .replace(/```/g, "");

        const nutrition =
        JSON.parse(cleanText);

        res.status(200).json(nutrition);

    }

    catch(error){

        console.log(error);

        res.status(500).json({
            error: "AI analysis failed"
        });
    }
}
