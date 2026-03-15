async function analyzeImage() {

  const fileInput = document.getElementById("imageInput");
  const resultDiv = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please upload an image first");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {

    const base64 = reader.result;

    resultDiv.innerText = "Analyzing food...";

    try {

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: base64
        })
      });

      const data = await response.json();

      resultDiv.innerText = data.result;

    } catch (err) {

      resultDiv.innerText = "Error analyzing food.";

    }

  };

  reader.readAsDataURL(file);

}
