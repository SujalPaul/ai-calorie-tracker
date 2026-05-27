const caloriesCtx = document.getElementById("caloriesChart");

const macroCtx = document.getElementById("macroChart");

const caloriesChart = new Chart(caloriesCtx, {
    type: "bar",

    data: {
        labels: [],
        datasets: [{
            label: "Calories",
            data: [],
            backgroundColor: "#c026d3"
        }]
    }
});

const macroChart = new Chart(macroCtx, {
    type: "doughnut",

    data: {
        labels: ["Protein", "Carbs", "Fat"],

        datasets: [{
            data: [0, 0, 0],

            backgroundColor: [
                "#ff00c8",
                "#7c3aed",
                "#2563eb"
            ]
        }]
    }
});
const foodImage =
document.getElementById("foodImage");

const previewImage =
document.getElementById("previewImage");

const foodInput =
document.getElementById("foodDescription");

const analyzeBtn =
document.getElementById("analyzeBtn");

const resultContainer =
document.getElementById("resultContainer");

const caloriesValue =
document.getElementById("caloriesValue");

const mealsValue =
document.getElementById("mealsValue");

const remainingValue =
document.getElementById("remainingValue");

const progressValue =
document.getElementById("progressValue");

const recentAnalysis =
document.getElementById("recentAnalysis");

const progressFill =
document.querySelector(".progress-fill");

/* TOTALS */

let totalCalories = 0;

let totalMeals = 0;

/* IMAGE PREVIEW */

foodImage.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(event) {

        previewImage.src =
        event.target.result;

        previewImage.style.display =
        "block";
    };

    reader.readAsDataURL(file);
});

/* ANALYZE FOOD */

analyzeBtn.addEventListener("click", async () => {

    const food =
    foodInput.value.trim();

    if (!food) {

        alert("Please enter food name");

        return;
    }

    analyzeBtn.innerText =
    "Analyzing...";

    analyzeBtn.disabled = true;

    try {

        const response =
        await fetch("/api/analyze-food", {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
                food
            })
        });

        const data =
        await response.json();
caloriesChart.data.labels.push(data.name);

caloriesChart.data.datasets[0].data.push(data.calories);

caloriesChart.update();

macroChart.data.datasets[0].data = [
    data.protein,
    data.carbs,
    data.fat
];

macroChart.update();
        console.log(data);

        if (data.error) {

            alert(data.error);

            analyzeBtn.innerText =
            "Analyze Nutrition";

            analyzeBtn.disabled =
            false;

            return;
        }

        /* SHOW RESULT */

        resultContainer.innerHTML = `

            <div class="result-card">

                <h2>
                    🍽 ${data.name}
                </h2>

                <div class="nutrition-grid">

                    <div class="nutrition-box">

                        <h3>
                            Calories
                        </h3>

                        <p>
                            ${data.calories} kcal
                        </p>

                    </div>

                    <div class="nutrition-box">

                        <h3>
                            Protein
                        </h3>

                        <p>
                            ${data.protein}g
                        </p>

                    </div>

                    <div class="nutrition-box">

                        <h3>
                            Carbs
                        </h3>

                        <p>
                            ${data.carbs}g
                        </p>

                    </div>

                    <div class="nutrition-box">

                        <h3>
                            Fat
                        </h3>

                        <p>
                            ${data.fat}g
                        </p>

                    </div>

                </div>

            </div>
        `;

        /* UPDATE DASHBOARD */

        totalCalories +=
        Number(data.calories);

        totalMeals++;

        caloriesValue.innerText =
        totalCalories;

        mealsValue.innerText =
        totalMeals;

        remainingValue.innerText =
        Math.max(
            2000 - totalCalories,
            0
        );

        const progress =
        Math.min(
            (totalCalories / 2000) * 100,
            100
        );

        progressValue.innerText =
        `${Math.round(progress)}%`;

        progressFill.style.width =
        `${progress}%`;

        /* ADD RECENT MEAL */

        const meal =
        document.createElement("div");

        meal.classList.add(
            "recent-meal"
        );

        meal.innerHTML = `

            <p>
                🍱 ${data.name}
            </p>

            <span>
                ${data.calories} kcal
            </span>
        `;

        recentAnalysis.prepend(meal);

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong");
    }

    analyzeBtn.innerText =
    "Analyze Nutrition";

    analyzeBtn.disabled = false;
});
