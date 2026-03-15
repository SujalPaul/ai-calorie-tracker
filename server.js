import express from "express";
import multer from "multer";
import fs from "fs";
import OpenAI from "openai";

const app = express();

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
});

app.post("/analyze-food", upload.single("image"), async (req,res)=>{

try{

const image = fs.readFileSync(req.file.path,{encoding:"base64"});

const response = await openai.chat.completions.create({

model:"gpt-4o-mini",

messages:[

{
role:"user",
content:[
{
type:"text",
text:"Identify the food in this image and estimate calories, protein, carbs and fat. Return clean readable text."
},

{
type:"image_url",
image_url:{
url:`data:image/jpeg;base64,${image}`
}
}

]
}

]

});

res.json({

result: response.choices[0].message.content

});

}catch(error){

console.log(error);

res.json({result:"Error analyzing image"});

}

});

app.listen(3000,()=>{

console.log("Server running on http://localhost:3000");

});
