const preview = document.getElementById("preview");

const fileInput = document.getElementById("foodImage");

const historyList = document.getElementById("historyList");

const ringProgress = document.getElementById("ringProgress");

const ringCalories = document.getElementById("ringCalories");

const mealCount = document.getElementById("mealCount");

const remainingCalories =
  document.getElementById("remainingCalories");

const progressPercent =
  document.getElementById("progressPercent");

let totalCalories = 0;

let meals = [];

/* IMAGE PREVIEW */

fileInput.addEventListener("change", () => {

  const file = fileInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {

    preview.src = e.target.result;

    preview.classList.remove("hidden");

  };

  reader.readAsDataURL(file);

});

/* THEME */

const themeToggle =
  document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {

    themeToggle.textContent = "☀️";

  } else {

    themeToggle.textContent = "🌙";

  }

});

/* ANALYZE */

async function analyzeFood() {

  const foodName =
    document.getElementById("foodName").value;

  const file = fileInput.files[0];

  if (!foodName || !file) {

    alert("Upload image and enter food name");

    return;
  }

  const loader =
    document.getElementById("loader");

  const resultCard =
    document.getElementById("resultCard");

  const resultText =
    document.getElementById("resultText");

  loader.classList.remove("hidden");

  resultCard.classList.add("hidden");

  const reader = new FileReader();

  reader.onloadend = async () => {

    try {

      const base64 = reader.result;

      const response = await fetch(
        "/api/analyze-food",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            image: base64,
            foodName
          })
        }
      );

      const data = await response.json();

      loader.classList.add("hidden");

      if (data.error) {

        resultText.innerHTML = `
          <p>${data.error}</p>
        `;

        resultCard.classList.remove("hidden");

        return;
      }

      const calories =
        parseInt(data.calories) || 0;

      const protein =
        parseFloat(data.protein) || 0;

      const carbs =
        parseFloat(data.carbs) || 0;

      const fat =
        parseFloat(data.fat) || 0;

      /* RESULT UI */

      resultText.innerHTML = `

        <div class="nutrition-title">

          <h2>🍜 ${foodName}</h2>

        </div>

        <div class="calorie-main">

          ${calories} kcal

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

      `;

      resultCard.classList.remove("hidden");

      /* DASHBOARD */

      totalCalories += calories;

      meals.push({
        name: foodName,
        calories
      });

      updateDashboard();

      updateHistory();

    } catch (err) {

      loader.classList.add("hidden");

      resultText.innerHTML = `
        <p>Something went wrong.</p>
      `;

      resultCard.classList.remove("hidden");

      console.log(err);

    }

  };

  reader.readAsDataURL(file);

}

/* DASHBOARD */

function updateDashboard() {

  ringCalories.textContent =
    totalCalories;

  mealCount.textContent =
    meals.length;

  const remaining =
    2000 - totalCalories;

  remainingCalories.textContent =
    `${remaining} kcal`;

  const percent =
    Math.min(
      (totalCalories / 2000) * 100,
      100
    );

  progressPercent.textContent =
    `${Math.round(percent)}%`;

  const circumference = 440;

  const offset =
    circumference -
    (percent / 100) * circumference;

  ringProgress.style.strokeDashoffset =
    offset;

}

/* HISTORY */

function updateHistory() {

  historyList.innerHTML = "";

  meals
    .slice()
    .reverse()
    .forEach(meal => {

      historyList.innerHTML += `

        <div class="history-item">

          <h3>
            🍜 ${meal.name}
          </h3>

          <p>
            ${meal.calories} kcal
          </p>

        </div>

      `;

    });

}
