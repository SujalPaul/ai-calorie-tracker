const fileInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const toggle = document.getElementById("themeToggle");

let history =
  JSON.parse(localStorage.getItem("nutritionHistory")) || [];

let totalCalories =
  Number(localStorage.getItem("totalCalories")) || 0;

const calorieGoal = 2000;

/* DARK MODE */

toggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  toggle.textContent =
    document.body.classList.contains("dark")
      ? "☀️"
      : "🌙";

});

/* IMAGE PREVIEW */

fileInput.addEventListener("change", () => {

  const file = fileInput.files[0];

  if (file) {

    preview.src = URL.createObjectURL(file);

    preview.classList.remove("hidden");

  }

});

/* FOOD EMOJIS */

function getEmoji(food) {

  food = food.toLowerCase();

  if (food.includes("pizza")) return "🍕";
  if (food.includes("burger")) return "🍔";
  if (food.includes("rice")) return "🍚";
  if (food.includes("biryani")) return "🍛";
  if (food.includes("pasta")) return "🍝";
  if (food.includes("cake")) return "🍰";
  if (food.includes("salad")) return "🥗";
  if (food.includes("chicken")) return "🍗";

  return "🍽️";

}

/* DASHBOARD */

function updateDashboard() {

  const eaten =
    document.getElementById("eatenCalories");

  const fill =
    document.getElementById("progressFill");

  eaten.textContent =
    `${totalCalories} kcal`;

  const percent =
    Math.min(
      (totalCalories / calorieGoal) * 100,
      100
    );

  fill.style.width =
    `${percent}%`;

}

/* HISTORY */

function renderHistory() {

  const historyList =
    document.getElementById("historyList");

  if (history.length === 0) {

    historyList.innerHTML = `
      <div class="empty-history">
        No analysis yet 🍽️
      </div>
    `;

    return;

  }

  historyList.innerHTML = "";

  history
    .slice()
    .reverse()
    .forEach(item => {

      historyList.innerHTML += `

        <div class="history-item">

          <h3>
            ${getEmoji(item.name)}
            ${item.name}
          </h3>

          <p>
            ${item.calories} kcal
          </p>

        </div>

      `;

    });

}

renderHistory();
updateDashboard();

/* ANALYZE FOOD */

async function analyzeFood() {

  const food =
    document.getElementById("foodName").value;

  if (!food) {

    alert("Please describe the food");

    return;

  }

  const resultCard =
    document.getElementById("resultCard");

  const resultText =
    document.getElementById("resultText");

  /* SHOW LOADER */

  resultCard.classList.add("hidden");

  loader.classList.remove("hidden");

  try {

    const response =
      await fetch("/api/analyze-food", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          food
        })

      });

    const data =
      await response.json();

    /* HIDE LOADER */

    loader.classList.add("hidden");

    resultCard.classList.remove("hidden");

    try {

      /* EXTRACT JSON */

      const match =
        data.result.match(/\{[\s\S]*\}/);

      if (!match) {

        resultText.textContent =
          "Could not analyze food.";

        return;

      }

      const parsed =
        JSON.parse(match[0]);

      /* RESULT UI */

      resultText.innerHTML = `

        <div class="nutrition-title">

          <h2>

            ${getEmoji(parsed.name)}
            ${parsed.name}

          </h2>

        </div>

        <div class="calorie-main">

          ${parsed.calories} kcal

        </div>

        <div class="nutrition-grid">

          <div class="nutrition-card">

            <h3>💪 Protein</h3>

            <p>
              ${parsed.protein}g
            </p>

          </div>

          <div class="nutrition-card">

            <h3>⚡ Carbs</h3>

            <p>
              ${parsed.carbs}g
            </p>

          </div>

          <div class="nutrition-card">

            <h3>🥑 Fat</h3>

            <p>
              ${parsed.fat}g
            </p>

          </div>

        </div>

      `;

      /* SAVE HISTORY */

      history.push(parsed);

      localStorage.setItem(
        "nutritionHistory",
        JSON.stringify(history)
      );

      /* UPDATE CALORIES */

      totalCalories +=
        Number(parsed.calories);

      localStorage.setItem(
        "totalCalories",
        totalCalories
      );

      /* REFRESH UI */

      renderHistory();

      updateDashboard();

    } catch {

      resultText.textContent =
        data.result;

    }

  } catch (error) {

    loader.classList.add("hidden");

    resultCard.classList.remove("hidden");

    resultText.textContent =
      "Something went wrong";

  }

}
