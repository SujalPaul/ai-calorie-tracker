async function getNutrition(){

let food = document.getElementById("foodInput").value;

const APP_ID = "YOUR_APP_ID";
const API_KEY = "YOUR_API_KEY";

let response = await fetch(
"https://trackapi.nutritionix.com/v2/natural/nutrients",
{
method:"POST",

headers:{
"x-app-id":APP_ID,
"x-app-key":API_KEY,
"Content-Type":"application/json"
},

body: JSON.stringify({
query: food
})

});

let data = await response.json();

let item = data.foods[0];

document.getElementById("result").innerHTML =

`
Calories: ${item.nf_calories} kcal <br>
Protein: ${item.nf_protein} g <br>
Carbs: ${item.nf_total_carbohydrate} g <br>
Fat: ${item.nf_total_fat} g
`;

}
