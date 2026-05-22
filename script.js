const foodInput = document.getElementById("foodInput");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const historyList = document.getElementById("historyList");

let totalCalories = 0;
let meals = 0;

let calorieHistory = [];
let proteinTotal = 0;
let carbsTotal = 0;
let fatTotal = 0;

/* IMAGE PREVIEW */

imageInput.addEventListener("change", () => {

  const file = imageInput.files[0];

  if(file){

    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";

  }

});

/* CHARTS */

const calorieChart = new Chart(
  document.getElementById("calorieChart"),
  {
    type:"line",
    data:{
      labels:[],
      datasets:[{
        label:"Calories",
        data:[],
        borderColor:"#ff00cc",
        backgroundColor:"rgba(255,0,204,0.2)",
        tension:0.4,
        fill:true
      }]
    }
  }
);

const macroChart = new Chart(
  document.getElementById("macroChart"),
  {
    type:"doughnut",
    data:{
      labels:["Protein","Carbs","Fat"],
      datasets:[{
        data:[0,0,0],
        backgroundColor:[
          "#ff00cc",
          "#7c3aed",
          "#2563eb"
        ]
      }]
    }
  }
);

/* LOAD SAVED */

const savedHistory =
JSON.parse(localStorage.getItem("nutritionHistory")) || [];

savedHistory.forEach(item=>{

  addToHistory(item.food,item.calories);

  totalCalories += item.calories;
  meals++;

  proteinTotal += item.protein;
  carbsTotal += item.carbs;
  fatTotal += item.fat;

  calorieHistory.push(item.calories);

});

updateDashboard();
updateCharts();

/* ANALYZE */

analyzeBtn.addEventListener("click", async ()=>{

  const food = foodInput.value.trim();

  if(!food){

    result.innerHTML = `
      <div class="error-card">
        Please enter food name
      </div>
    `;

    return;
  }

  analyzeBtn.disabled = true;
  analyzeBtn.innerText = "Analyzing...";

  result.innerHTML = `
    <div class="loading-card">
      <div class="loader"></div>
      <p>Analyzing nutrition...</p>
    </div>
  `;

  try{

    const response = await fetch("/api/analyze-food",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({ food })
    });

    const data = await response.json();

    const calories = Number(data.calories) || 150;
    const protein = Number(data.protein) || 3;
    const carbs = Number(data.carbs) || 30;
    const fat = Number(data.fat) || 1;

    totalCalories += calories;
    meals++;

    proteinTotal += protein;
    carbsTotal += carbs;
    fatTotal += fat;

    calorieHistory.push(calories);

    updateDashboard();
    updateCharts();

    addToHistory(food,calories);

    saveMeal({
      food,
      calories,
      protein,
      carbs,
      fat
    });

    result.innerHTML = `
      <div class="nutrition-result">

        <h2>🍜 ${food}</h2>

        <div class="calorie-circle">
          <span>${calories}</span>
          <p>kcal</p>
        </div>

        <div class="nutrition-grid">

          <div class="nutrition-card">
            <h3>💪 Protein</h3>
            <p>${protein}g</p>
          </div>

          <div class="nutrition-card">
            <h3>⚡ Carbs</h3>
            <p>${carbs}g</p>
          </div>

          <div class="nutrition-card">
            <h3>🥑 Fat</h3>
            <p>${fat}g</p>
          </div>

        </div>

      </div>
    `;

  }catch{

    result.innerHTML = `
      <div class="error-card">
        Failed to analyze food
      </div>
    `;

  }

  analyzeBtn.disabled = false;
  analyzeBtn.innerText = "Analyze Nutrition";

});

/* HISTORY */

function addToHistory(food,calories){

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    <h4>🍱 ${food}</h4>
    <p>${calories} kcal</p>
  `;

  historyList.prepend(item);

}

/* SAVE */

function saveMeal(meal){

  const existing =
  JSON.parse(localStorage.getItem("nutritionHistory")) || [];

  existing.push(meal);

  localStorage.setItem(
    "nutritionHistory",
    JSON.stringify(existing)
  );

}

/* DASHBOARD */

function updateDashboard(){

  document.getElementById("totalCalories").innerText =
  totalCalories;

  document.getElementById("mealCount").innerText =
  meals;

  document.getElementById("remainingCalories").innerText =
  2000-totalCalories;

  const progress =
  Math.min((totalCalories/2000)*100,100);

  document.getElementById("progressPercent").innerText =
  Math.round(progress)+"%";

  document.getElementById("progressFill").style.width =
  progress+"%";

}

/* CHARTS */

function updateCharts(){

  calorieChart.data.labels =
  calorieHistory.map((_,i)=>`Meal ${i+1}`);

  calorieChart.data.datasets[0].data =
  calorieHistory;

  calorieChart.update();

  macroChart.data.datasets[0].data = [
    proteinTotal,
    carbsTotal,
    fatTotal
  ];

  macroChart.update();

}
