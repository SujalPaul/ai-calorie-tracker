const foodImageInput =
document.getElementById("foodImage");

const previewImage =
document.getElementById("previewImage");

const foodDescription =
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

let totalCalories = 0;

let meals = 0;

const goalCalories = 2000;

let uploadedBase64 = "";


/* IMAGE UPLOAD */

foodImageInput.addEventListener("change", (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {

        const img = new Image();

        img.onload = () => {

            const canvas =
            document.createElement("canvas");

            const ctx =
            canvas.getContext("2d");

            const MAX_WIDTH = 512;

            let width = img.width;
            let height = img.height;

            if (width > MAX_WIDTH) {

                height =
                height * (MAX_WIDTH / width);

                width = MAX_WIDTH;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(

                img,

                0,
                0,

                width,
                height
            );

            const compressedImage =
            canvas.toDataURL(

                "image/jpeg",

                0.7
            );

            previewImage.src =
            compressedImage;

            previewImage.style.display =
            "block";

            uploadedBase64 =
            compressedImage.split(",")[1];

            console.log(
                "Compressed image ready"
            );
        };

        img.src =
        event.target.result;
    };

    reader.readAsDataURL(file);
});


/* ANALYZE FOOD */

analyzeBtn.addEventListener("click", async () => {

    if (!uploadedBase64) {

        alert("Please upload image");

        return;
    }

    analyzeBtn.innerText =
    "Analyzing...";

    try {

        const response =
        await fetch(

            "/api/analyze-food",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({

                    image: uploadedBase64,

                    description:
                    foodDescription.value
                })
            }
        );

        console.log(response);

        const data =
        await response.json();

        console.log(data);

        if (!data.success) {

            alert(data.error);

            analyzeBtn.innerText =
            "Analyze Nutrition";

            return;
        }

        const nutrition =
        data.result;

        showResult(nutrition);

        updateDashboard(nutrition);

        addRecentMeal(nutrition);

        analyzeBtn.innerText =
        "Analyze Nutrition";

    } catch (error) {

        console.log(error);

        alert(error.message);

        analyzeBtn.innerText =
        "Analyze Nutrition";
    }
});


/* SHOW RESULT */

function showResult(data) {

    resultContainer.innerHTML = `

    <div class="nutrition-card">

        <h2>${data.food}</h2>

        <div class="nutrition-circle">

            <h1>${data.calories}</h1>

            <p>kcal</p>

        </div>

        <div class="nutrition-grid">

            <div class="nutrition-box">

                <h3>Protein</h3>

                <p>${data.protein}g</p>

            </div>

            <div class="nutrition-box">

                <h3>Carbs</h3>

                <p>${data.carbs}g</p>

            </div>

            <div class="nutrition-box">

                <h3>Fat</h3>

                <p>${data.fat}g</p>

            </div>

        </div>

    </div>
    `;
}


/* DASHBOARD */

function updateDashboard(data) {

    totalCalories +=
    Number(data.calories);

    meals++;

    caloriesValue.innerText =
    totalCalories;

    mealsValue.innerText =
    meals;

    remainingValue.innerText =
    goalCalories - totalCalories;

    const progress =
    Math.min(

        (totalCalories / goalCalories) * 100,

        100
    );

    progressValue.innerText =
    `${Math.round(progress)}%`;
}


/* RECENT MEALS */

function addRecentMeal(data) {

    const meal =
    document.createElement("div");

    meal.classList.add("recent-meal");

    meal.innerHTML = `

        <p>🍱 ${data.food}</p>

        <span>${data.calories} kcal</span>
    `;

    recentAnalysis.prepend(meal);
}
