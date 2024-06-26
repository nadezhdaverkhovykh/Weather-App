const search = document.querySelector(".input");
const searchButton = document.querySelector(".search_button");
const city = document.querySelector(".city");
const temperature = document.querySelector(".current_temperature");
const weatherDate = document.querySelector(".current_date");
const weatherCondition = document.querySelector(".current_condition");
const weatherIcon = document.querySelector(".weather_icon");

const API_KEY = "b670c199124312bae8d95721100c9c19";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

async function fetchData(url, query) {
  const response = await fetch(
    url + query + "&appid=" + API_KEY + "&units=metric"
  );
  const data = await response.json();
  return data;
}
async function fetchWeather() {
  const weatherData = await fetchData(BASE_URL, "?q=токио");
  console.log(weatherData);
  renderWeather(weatherData);
}

function renderWeather(weatherData) {
  let currentDate = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "short",
  };
  city.innerHTML = `<p>${weatherData.name}</p>`;
  weatherDate.innerHTML = `<p>${`${currentDate.toLocaleString(
    "en-US",
    options
  )}`}</p>`;
  // temperature.innerHTML = `<p>${Math.round(weatherData.main.temp)}°C</p>`;
  temperature.innerHTML = `<p>${weatherData.main.temp.toFixed(0)}°C</p>`;
  weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png">`;
  weatherCondition.innerHTML = `<p>${weatherData.weather[0].main}</p>`;
}

async function findCity() {
  const searchValue = search.value.trim();
  if (searchValue !== "") {
    const url =
      BASE_URL + "?q=" + searchValue + "&appid=" + API_KEY + "&units=metric";
    const weatherData = await fetchData(url);
    renderWeather(weatherData);
  }
}

fetchWeather();

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  await findCity();
});
