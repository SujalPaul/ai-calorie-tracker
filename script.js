const fileInput = document.getElementById("foodImage");
const preview = document.getElementById("preview");

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

  resultCard.classList.remove("hidden");
  resultText.textContent = "Analyzing...";

  try {
    const response = await fetch("/api/analyze-food", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ food })
    });

    const data = await response.json();

    resultText.textContent = data.result || data.error;

  } catch (error) {
    resultText.textContent = "Error occurred";
  }
}
