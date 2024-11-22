var searchBtn = document.getElementById("searchBtn");
var table = document.getElementById("table");
var currentSection = document.getElementById("current");

const getCity = async (city) => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
  );
  const data = await res.json();

  return data.results[0];
};

const getWeather = async (latitude, longitude) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
  );
  const data = await res.json();
  return data;
};

const buildHtml = async (cityInput) => {
  const cityData = await getCity(cityInput);
  const weather = await getWeather(cityData.latitude, cityData.longitude);
  const current_units = weather.current_units;
  const current = weather.current;
  const daily = weather.daily;

  //current weather
  let currentWeatherHtml = "";
  currentWeatherHtml += `<span>${cityData.name} </span><span>${current.temperature_2m} ${current_units.temperature_2m}</span>`;
  currentSection.innerHTML = currentWeatherHtml;

  if (current.is_day == "0") {
    currentSection.style.backgroundImage = "url(images/night.jpg)";
    currentSection.style.color = "grey";
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  } else {
    currentSection.style.backgroundImage = "url(images/day.jpg)";
    currentSection.style.color = "black";
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  }

  //table section
  let weatherHtml = "";
  weatherHtml += `
  <table>
    <tr>
      <td>Country</td>
      <td>${cityData.country}</td>
    </tr>
    <tr>
      <td>Timezone</td>
      <td>${cityData.timezone}</td>
    </tr>
    <tr>
      <td>Population</td>
      <td>${cityData.population}</td>
    </tr>
    <tr>
      <td>Tomorrow's Forecast</td>
      <td>Low ${daily.temperature_2m_min}${current_units.temperature_2m}<br>Max ${daily.temperature_2m_max}${current_units.temperature_2m}</td>
    </tr>
  </table>`;

  table.innerHTML = weatherHtml;
};

searchBtn.addEventListener("click", () => {
  const cityInput = document.getElementById("city").value;
  buildHtml(cityInput);
});
