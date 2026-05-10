const fileInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const toggle = document.getElementById("themeToggle");

let history = JSON.parse(localStorage.getItem("nutritionHistory")) || [];

/* Theme Toggle */
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* Image Preview */
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
});

/* Food Emoji */
function getEmoji(food) {
  food = food.toLowerCase();

  if (food.includes("pizza")) return "🍕";
  if (food.includes("burger")) return "🍔";
  if (food.includes("rice")) return "🍚";
  if (food.includes("biryani")) return "🍛";
  if (food.includes("pasta")) return "🍝";
  if (food.includes("cake")) return "🍰";

  return "🍽️";
}

/* Render History */
function renderHistory() {

  const historyList = document.getElementById("historyList");

 if (history.length === 0) {

  historyList.innerHTML = `
    <div class="empty-history">
      No analysis yet 🍽️
    </div>
  `;

  return;
}

historyList.innerHTML = "";

  history.slice().reverse().forEach(item => {

    historyList.innerHTML += `
      <div class="history-item">
        <h3>${getEmoji(item.name)} ${item.name}</h3>
        <p>${item.calories} kcal</p>
      </div>
    `;
  });
}

renderHistory();

/* Analyze */
async function analyzeFood() {

  const food = document.getElementById("foodName").value;

  if (!food) {
    alert("Please describe the food");
    return;
  }

  const resultCard = document.getElementById("resultCard");
  const resultText = document.getElementById("resultText");

  resultCard.classList.add("hidden");
  loader.classList.remove("hidden");

  try {

    const response = await fetch("/api/analyze-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ food })
    });

    const data = await response.json();

    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");

    try {

      const parsed = JSON.parse(data.result);

      resultText.innerHTML = `
        <div class="nutrition-title">
          <h2>${getEmoji(parsed.name)} ${parsed.name}</h2>
        </div>

        <div class="calorie-main">
          ${parsed.calories} kcal
        </div>

        <div class="nutrition-grid">

          <div class="nutrition-card">
            <h3>Protein</h3>
            <p>${parsed.protein}g</p>
          </div>

          <div class="nutrition-card">
            <h3>Carbs</h3>
            <p>${parsed.carbs}g</p>
          </div>

          <div class="nutrition-card">
            <h3>Fat</h3>
            <p>${parsed.fat}g</p>
          </div>

        </div>
      `;

      history.push(parsed);

      localStorage.setItem(
        "nutritionHistory",
        JSON.stringify(history)
      );

      renderHistory();

    } catch {

      resultText.textContent = data.result;

    }

  } catch (error) {

    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");

    resultText.textContent = "Something went wrong";

  }
}
