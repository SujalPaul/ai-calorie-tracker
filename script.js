async function getNutrition(){

let food = document.getElementById("foodInput").value;

let response = await fetch(

"https://trackapi.nutritionix.com/v2/natural/nutrients",

{

method:"POST",

headers:{

"x-app-id":NUTRITION_APP_ID,

"x-app-key":NUTRITION_API_KEY,

"Content-Type":"application/json"

},

body: JSON.stringify({

query: food

})

}

);

let data = await response.json();

let item = data.foods[0];

document.getElementById("result").innerHTML =

`
Food: ${item.food_name} <br>
Calories: ${item.nf_calories} kcal <br>
Protein: ${item.nf_protein} g <br>
Carbs: ${item.nf_total_carbohydrate} g <br>
Fat: ${item.nf_total_fat} g
`;

}

async function analyzeImage(){

let file = document.getElementById("imageInput").files[0];

let reader = new FileReader();

reader.onloadend = async function(){

let base64 = reader.result.split(",")[1];

let response = await fetch(

"https://api.clarifai.com/v2/models/food-item-recognition/outputs",

{

method:"POST",

headers:{

"Authorization":"Key " + CLARIFAI_API_KEY,

"Content-Type":"application/json"

},

body: JSON.stringify({

inputs:[{

data:{

image:{

base64:base64

}

}

}]

})

}

);

let data = await response.json();

let detectedFood = data.outputs[0].data.concepts[0].name;

document.getElementById("foodInput").value = detectedFood;

getNutrition();

};

reader.readAsDataURL(file);

}
