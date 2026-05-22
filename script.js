const foodInput = document.getElementById("foodInput");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeBtn = document.getElementById("analyzeBtn");
const result = document.getElementById("result");
const historyList = document.getElementById("historyList");

let totalCalories = 0;
let meals = 0;

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];

  if (file) {
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";
  }
});

analyzeBtn.addEventListener("click", async () => {
  const food = foodInput.value.trim();

  if (!food) {
    result.innerHTML = `
      <div class="error-card">
        Please enter food name
      </div>
    `;
    return;
  }

  analyzeBtn.innerHTML = "Analyzing...";
  analyzeBtn.disabled = true;

  result.innerHTML = `
    <div class="loading-card">
      <div class="loader"></div>
      <p>Analyzing nutrition...</p>
    </div>
  `;

  try {
    const response = await fetch("/api/analyze-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ food }),
    });

    const data = await response.json();

    if (data.error) {
      result.innerHTML = `
        <div class="error-card">
          ${data.error}
        </div>
      `;
      return;
    }

    const calories = Number(data.calories) || 0;
    const protein = Number(data.protein) || 0;
    const carbs = Number(data.carbs) || 0;
    const fat = Number(data.fat) || 0;

    totalCalories += calories;
    meals++;

    updateDashboard();

    addToHistory(food, calories);

    result.innerHTML = `
      <div class="nutrition-result">
        <h2>🍜 ${data.name}</h2>

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
  } catch (error) {
    result.innerHTML = `
      <div class="error-card">
        Failed to analyze food
      </div>
    `;
  }

  analyzeBtn.innerHTML = "Analyze Nutrition";
  analyzeBtn.disabled = false;
});

function addToHistory(food, calories) {
  const item = document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    <h4>🍱 ${food}</h4>
    <p>${calories} kcal</p>
  `;

  historyList.prepend(item);
}

function updateDashboard() {
  document.getElementById("totalCalories").innerText = totalCalories;
  document.getElementById("mealCount").innerText = meals;
  document.getElementById("remainingCalories").innerText =
    2000 - totalCalories;

  const progress = Math.min((totalCalories / 2000) * 100, 100);

  document.getElementById("progressPercent").innerText =
    Math.round(progress) + "%";

  document.getElementById("progressFill").style.width =
    progress + "%";
}
