async function analyzeImage() {

  const fileInput = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please upload a food image first.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {

    const base64Image = reader.result;

    try {

      resultDiv.innerText = "Analyzing food...";

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      const data = await response.json();

      if (data.result) {
        resultDiv.innerText = data.result;
      } else {
        resultDiv.innerText = "Failed to analyze food.";
      }

    } catch (error) {

      console.error(error);
      resultDiv.innerText = "Error analyzing image.";

    }

  };

  reader.readAsDataURL(file);

}
