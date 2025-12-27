// OpenWeather API key
const apiKey = "908619b937ad24358e8ae28b9c326903";

// Getting HTML elements
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");
const forecastDiv = document.getElementById("forecast");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");

// When Search button is clicked
getWeatherBtn.addEventListener("click", getWeather);

// Toggle day/night theme
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("night");
  document.body.classList.toggle("day");

  // Change icon depending on theme
  toggleThemeBtn.textContent =
    document.body.classList.contains("night") ? "☀️" : "🌙";
});

// Function to get weather data
function getWeather() {
  const city = cityInput.value.trim();

  // Check if input is empty
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Fetch CURRENT weather data
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => displayWeather(data))
    .catch(error => {
      weatherDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    });

  // Fetch 5-DAY forecast data
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  )
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => displayForecast(data))
    .catch(error => {
      forecastDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
    });
}

// Display current weather
function displayWeather(data) {
  const icon = data.weather[0].icon;

  weatherDiv.innerHTML = `
    <h2>${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" />
    <p><strong>${data.main.temp}°C</strong></p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>${data.weather[0].description}</p>
  `;
}

// Display 5-day forecast
function displayForecast(data) {
  forecastDiv.innerHTML = "";

  // Filter data to get one forecast per day (12:00 PM)
  const dailyForecast = data.list.filter(item =>
    item.dt_txt.includes("12:00:00")
  );

  // Get today's date string for comparison
  const todayStr = new Date().toLocaleDateString();

  // Loop through each day
  dailyForecast.forEach(day => {
    const dateObj = new Date(day.dt_txt);
    const dateStr = dateObj.toLocaleDateString();

    // Determine label: "Today" if today, else short weekday name like Mon, Tue
    let dayLabel;
    if (dateStr === todayStr) {
      dayLabel = "Today";
    } else {
      dayLabel = dateObj.toLocaleDateString(undefined, { weekday: "short" });
    }

    const icon = day.weather[0].icon;

    forecastDiv.innerHTML += `
      <div class="forecast-card">
        <p>${dayLabel}</p>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}
