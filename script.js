const foodImageInput =
document.getElementById("foodImage");

const previewImage =
document.getElementById("previewImage");

const analyzeBtn =
document.getElementById("analyzeBtn");

const resultCard =
document.getElementById("resultCard");

const foodTitle =
document.getElementById("foodTitle");

const foodCalories =
document.getElementById("foodCalories");

const protein =
document.getElementById("protein");

const carbs =
document.getElementById("carbs");

const fat =
document.getElementById("fat");

const totalCalories =
document.getElementById("totalCalories");

const mealCount =
document.getElementById("mealCount");

const remainingCalories =
document.getElementById("remainingCalories");

const progressPercent =
document.getElementById("progressPercent");

const progressFill =
document.getElementById("progressFill");

const recentMeals =
document.getElementById("recentMeals");

let currentCalories = 0;
let meals = 0;

/* IMAGE PREVIEW */

foodImageInput.addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(event){

        previewImage.src =
        event.target.result;

        previewImage.style.display =
        "block";
    };

    reader.readAsDataURL(file);

});

/* ANALYZE */

analyzeBtn.addEventListener("click",()=>{

    const food =
    document.getElementById("foodInput").value;

    if(food.trim() === ""){

        alert("Please enter food name");

        return;
    }

    /* FAKE AI VALUES */

    const calories =
    Math.floor(Math.random()*400)+100;

    const proteinValue =
    Math.floor(Math.random()*30)+5;

    const carbsValue =
    Math.floor(Math.random()*50)+10;

    const fatValue =
    Math.floor(Math.random()*20)+3;

    /* SHOW RESULT */

    resultCard.style.display =
    "block";

    foodTitle.innerText =
    food;

    foodCalories.innerText =
    calories;

    protein.innerText =
    proteinValue + "g";

    carbs.innerText =
    carbsValue + "g";

    fat.innerText =
    fatValue + "g";

    /* UPDATE DASHBOARD */

    currentCalories += calories;

    meals++;

    totalCalories.innerText =
    currentCalories;

    mealCount.innerText =
    meals;

    remainingCalories.innerText =
    2000 - currentCalories;

    const progress =
    Math.min(
        (currentCalories / 2000) * 100,
        100
    );

    progressPercent.innerText =
    progress.toFixed(0) + "%";

    progressFill.style.width =
    progress + "%";

    /* RECENT */

    const item =
    document.createElement("div");

    item.className =
    "recent-item";

    item.innerHTML = `
        🍜 ${food}
        <br>
        ${calories} kcal
    `;

    recentMeals.prepend(item);

});
