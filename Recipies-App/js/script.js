const meals = document.getElementById("meals");
const favMeals = document.getElementById("fav-meals");

getRandomMeal();
fetchFavMeals();

async function getRandomMeal() {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true);
}

async function getMealById(id) {
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?id="+ id);
    const respData = await resp.json();
    const meal = respData.meals[0];
    return meal;
}

async function getMealsBySearch(term) {
    const meals = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?id="+ term);
}

function addMeal(mealData,  random = false) {
    const meal = document.createElement('div');
    meal.classList.add("meal");
    meal.innerHTML = `
    <div class="meal-header">
    ${random ? `<span class="random">Random Recipe</span>` : ''}

      <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>
    <div class="meal-body">
      <h4>${mealData.strMeal}</h4>
       <button class="fav-btn"><i class="fa fa-heart"></i></button>
    </div>`;
    meals.appendChild(meal)
     
    // button actions
    const btnFav = document.querySelector(".fav-btn");

    btnFav.addEventListener("click", () => {
        
        if (btnFav.classList.contains('active')) {
            removeMealLs(mealData.idMeal)
            btnFav.classList.remove("active");
        }
        else{
            addMealsLs(mealData.idMeal)
            btnFav.classList.toggle("active");
        }

    });
};

function addMealsLs(mealId) {
    const mealIds = getMealsLs();
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLs(mealId) {
    const mealIds = getMealsLs();
    localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)));
}

function getMealsLs() {
    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
    const mealIds = getMealsLs();
    const meals = [];

    for (let i = 0; i < mealIds.length; i++) {
        const mealId = mealIds[i];
        meal = await getMealById(mealId);
        meals.append(meal);
    };
    console.log(meals);
}