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

        const prompt = `
        Analyze this food.

        Return ONLY valid JSON.

        Format:

        {
          "name": "",
          "calories": 0,
          "protein": 0,
          "carbs": 0,
          "fat": 0
        }
        `;

        let parts = [];

        /* IMAGE MODE */

        if(image){

            parts = [

                {
                    text: prompt
                },

                {
                    inlineData: {

                        mimeType: "image/jpeg",

                        data: image
                    }
                }
            ];
        }

        /* TEXT MODE */

        else{

            parts = [

                {
                    text:
                    prompt + "\nFood: " + food
                }
            ];
        }

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
                            role: "user",

                            parts
                        }
                    ]
                })
            }
        );

        const data =
        await response.json();

        console.log(JSON.stringify(data));

        const text =
        data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text;

        if(!text){

            return res.status(500).json({

                error:
                data?.error?.message ||
                "No AI response"
            });
        }

        const cleanText =
        text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        let nutrition;

        try{

            nutrition =
            JSON.parse(cleanText);

        }

        catch{

            return res.status(500).json({

                error:
                "Invalid AI JSON",

                raw: cleanText
            });
        }

        res.status(200).json(nutrition);

    }

    catch(error){

        console.log(error);

        res.status(500).json({

            error:
            "AI analysis failed"
        });
    }
}
