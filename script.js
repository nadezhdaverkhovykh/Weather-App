const search = document.querySelector(".input");
const searchButton = document.querySelector(".search_button");
const city = document.querySelector(".city");
const temperature = document.querySelector(".current_temperature");
const weatherDate = document.querySelector(".current_date");
const weatherCondition = document.querySelector(".current_condition");
const getImage = document.querySelector(".image_div");
const weatherCard = document.querySelector(".weather_card");
const geoButton = document.querySelector(".geo_button");

const API_KEY = "b670c199124312bae8d95721100c9c19";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function fetchData(url, query) {
  try {
    const response = await fetch(
      url + query + "&appid=" + API_KEY + "&units=metric"
    );
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    displayError(error);
  }
}

async function fetchWeather() {
  const weatherData = await fetchData(BASE_URL, "?q=токио");
  console.log(weatherData);
  renderWeather(weatherData);
}

function renderWeather(weatherData) {
  weatherCard.innerHTML = "";
  const cardDiv = document.createElement("div");
  let currentDate = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };
  cardDiv.innerHTML = `<p class="city">${weatherData.name}</p>   
  <p class="current_date">${`${currentDate.toLocaleString(
    "en-US",
    options
  )}`} </p> 
  <p class="current_temperature">${Math.round(weatherData.main.temp)}°C</p>
  <div class="image_div"> <img src="https://openweathermap.org/img/wn/${
    weatherData.weather[0].icon
  }@4x.png"></div> 
    
    <p class="current_condition">${weatherData.weather[0].main}</p>
  `;
  weatherCard.append(cardDiv);
}

async function findCity() {
  const searchValue = search.value.trim();
  if (searchValue !== "") {
    const url = BASE_URL + "?q=";
    fetchData(url, searchValue);
  }
}

fetchWeather();

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await findCity();
});

geoButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(navigatorSuccess, navigatorError);
  } else {
    navigatorError();
  }
});

navigator.geolocation.getCurrentPosition(navigatorSuccess, navigatorError);

function navigatorSuccess(geo) {
  const query = `?lat=${geo.coords.latitude}&lon=${geo.coords.longitude}`;
  fetchData(BASE_URL, query);
}
async function navigatorError() {
  try {
    const res = await fetch(
      "https://geo.ipify.org/api/v2/country?apiKey=at_eo04YiZlAV0leI1yLJVW8pZFe3wMH"
    );
    if (!res.ok) {
      throw new Error("Error");
    }
    const data = await res.json();
    fetchData(BASE_URL, "?q=" + data.location.region);
  } catch (error) {
    displayError(error);
  }
}

function displayError(error) {
  weatherCard.innerHTML = "";
  const cardDiv = document.createElement("div");
  cardDiv.innerHTML = `<p>${error}</p>`;
  cardDiv.classList.add("error_title");
  weatherCard.append(cardDiv);
}
