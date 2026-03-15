async function analyzeFood() {

  const fileInput = document.getElementById("foodImage");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please upload an image");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = async () => {

    const base64 = reader.result;

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

    document.getElementById("result").textContent =
      data.result || data.error;

  };

  reader.readAsDataURL(file);

}
