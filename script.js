async function analyzeImage(){

const fileInput = document.getElementById("imageInput");

const file = fileInput.files[0];

if(!file){

alert("Please upload an image");

return;

}

const formData = new FormData();

formData.append("image", file);

const response = await fetch(

"http://localhost:3000/analyze-food",

{

method:"POST",

body:formData

}

);

const data = await response.json();

document.getElementById("result").innerText = data.result;

}
