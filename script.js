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

analyzeBtn.addEventListener("click", () => {

    const food =
    document
    .getElementById("foodInput")
    .value;

    if(food.trim() === ""){

        alert("Please enter food name");

        return;
    }

    /* RANDOM AI VALUES */

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

    /* RECENT MEALS */

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

    /* UPDATE CALORIE CHART */

    calorieChart.data.labels.push(
        "Meal " + meals
    );

    calorieChart.data.datasets[0].data.push(
        calories
    );

    calorieChart.update();

    /* UPDATE MACRO CHART */

    macroChart.data.datasets[0].data = [

        totalProtein,
        totalCarbs,
        totalFat
    ];

    macroChart.update();

});
