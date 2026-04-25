const fileInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");
const loader = document.getElementById("loader");

// Image preview
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
  }
});

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
        <div class="nutrition">
          <h2>${parsed.name}</h2>
          <div class="calories">${parsed.calories} kcal</div>

          <div class="macros">
            <div class="macro-card">
              <strong>Protein</strong><br>${parsed.protein}g
            </div>
            <div class="macro-card">
              <strong>Carbs</strong><br>${parsed.carbs}g
            </div>
            <div class="macro-card">
              <strong>Fat</strong><br>${parsed.fat}g
            </div>
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
