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

/* TOTALS */

let currentCalories = 0;

let meals = 0;

let totalProtein = 0;
let totalCarbs = 0;
let totalFat = 0;

/* IMAGE STORAGE */

let uploadedBase64 = "";

/* IMAGE PREVIEW */

foodImageInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event){

        previewImage.src =
        event.target.result;

        previewImage.style.display =
        "block";

        uploadedBase64 =
        event.target.result
        .split(",")[1];
    };

    reader.readAsDataURL(file);

});

/* CALORIE CHART */

const calorieCtx =
document
.getElementById("calorieChart")
.getContext("2d");

const calorieChart =
new Chart(calorieCtx, {

    type: "line",

    data: {

        labels: [],

        datasets: [{

            label: "Calories",

            data: [],

            borderColor: "#7c4dff",

            backgroundColor:
            "rgba(124,77,255,0.2)",

            tension: 0.4,

            fill: true,

            pointRadius: 5,

            pointBackgroundColor:
            "#ff00c8"

        }]
    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: "white"
                }
            }
        },

        scales: {

            x: {

                ticks: {

                    color: "white"
                },

                grid: {

                    color:
                    "rgba(255,255,255,0.05)"
                }
            },

            y: {

                ticks: {

                    color: "white"
                },

                grid: {

                    color:
                    "rgba(255,255,255,0.05)"
                }
            }
        }
    }
});

/* MACRO CHART */

const macroCtx =
document
.getElementById("macroChart")
.getContext("2d");

const macroChart =
new Chart(macroCtx, {

    type: "doughnut",

    data: {

        labels: [
            "Protein",
            "Carbs",
            "Fat"
        ],

        datasets: [{

            data: [0,0,0],

            backgroundColor: [

                "#ff00c8",
                "#7c4dff",
                "#2563eb"
            ],

            borderWidth: 0
        }]
    },

    options: {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: "white"
                }
            }
        }
    }
});

/* ANALYZE */

analyzeBtn.addEventListener("click", async () => {

    const food =
    document
    .getElementById("foodInput")
    .value;

    if(
        food.trim() === "" &&
        uploadedBase64 === ""
    ){

        alert(
            "Upload image or enter food name"
        );

        return;
    }

    analyzeBtn.innerText =
    "Analyzing...";

    analyzeBtn.disabled = true;

    try{

        const response =
        await fetch("/api/analyze-food", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

                food,

                image: uploadedBase64
            })
        });

        const data =
        await response.json();

        if(data.error){

            alert(data.error);

            analyzeBtn.innerText =
            "Analyze Nutrition";

            analyzeBtn.disabled =
            false;

            return;
        }

        const calories =
        Number(data.calories);

        const proteinValue =
        Number(data.protein);

        const carbsValue =
        Number(data.carbs);

        const fatValue =
        Number(data.fat);

        /* SHOW RESULT */

        resultCard.style.display =
        "block";

        foodTitle.innerText =
        data.name || food;

        foodCalories.innerText =
        calories;

        protein.innerText =
        proteinValue + "g";

        carbs.innerText =
        carbsValue + "g";

        fat.innerText =
        fatValue + "g";

        /* UPDATE TOTALS */

        currentCalories += calories;

        meals++;

        totalProtein += proteinValue;

        totalCarbs += carbsValue;

        totalFat += fatValue;

        /* DASHBOARD */

        totalCalories.innerText =
        currentCalories;

        mealCount.innerText =
        meals;

        remainingCalories.innerText =
        Math.max(
            2000 - currentCalories,
            0
        );

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
            🍜 ${data.name}
            <br>
            ${calories} kcal
        `;

        recentMeals.prepend(item);

        /* CALORIE CHART */

        calorieChart.data.labels.push(
            "Meal " + meals
        );

        calorieChart.data.datasets[0].data.push(
            calories
        );

        calorieChart.update();

        /* MACRO CHART */

        macroChart.data.datasets[0].data = [

            totalProtein,
            totalCarbs,
            totalFat
        ];

        macroChart.update();

    }

    catch(error){

        console.log(error);

        alert("AI analysis failed");

    }

    analyzeBtn.innerText =
    "Analyze Nutrition";

    analyzeBtn.disabled = false;

});
