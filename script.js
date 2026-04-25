const fileInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");
const toggle = document.getElementById("themeToggle");

// Image preview
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
});

// Dark mode toggle
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Emoji generator
function getEmoji(food) {
  food = food.toLowerCase();
  if (food.includes("pizza")) return "🍕";
  if (food.includes("burger")) return "🍔";
  if (food.includes("rice") || food.includes("biryani")) return "🍚";
  if (food.includes("pasta") || food.includes("mac")) return "🍝";
  return "🍽️";
}

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ food })
    });

    const data = await response.json();

    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");

    try {
      const parsed = JSON.parse(data.result);

      resultText.innerHTML = `
        <div class="nutrition">
          <h2>${getEmoji(parsed.name)} ${parsed.name}</h2>
          <div class="calories">${parsed.calories} kcal</div>

          <div class="macros">
            <div class="macro-card">Protein<br><strong>${parsed.protein}g</strong></div>
            <div class="macro-card">Carbs<br><strong>${parsed.carbs}g</strong></div>
            <div class="macro-card">Fat<br><strong>${parsed.fat}g</strong></div>
          </div>
        </div>
      `;
    } catch {
      resultText.textContent = data.result;
    }

  } catch (error) {
    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");
    resultText.textContent = "Error occurred";
  }
}
