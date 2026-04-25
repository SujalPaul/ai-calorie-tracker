async function analyzeFood() {

  const food = document.getElementById("foodName").value;

  if (!food) {
    alert("Please enter a food name");
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
