async function analyzeImage(){

const file = document.getElementById("imageInput").files[0];

const reader = new FileReader();

reader.onload = async function(){

const base64 = reader.result;

const response = await fetch("/api/analyze-food", {

method: "POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({
image: base64
})

});

const data = await response.json();

document.getElementById("result").innerText = data.result;

};

reader.readAsDataURL(file);

}
