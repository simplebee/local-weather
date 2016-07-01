function ajax() {
  return $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather",
    data: {
      q: "london,uk",
      APPID: openWeatherMap.apikey
    },
    type: "GET",
    datatype: "json"
  });
}

function getData(data) {
  console.log("Success");
  console.log(data);
  console.log("location", data.name);
  console.log("time", convertUnixTime(data.dt));
  console.log("icon", getIcon(data.weather[0].icon));
  console.log("temp", kelvinToCelsius(data.main.temp));
  console.log("description", capitaliseFirstLetter(data.weather[0].description));
  console.log("wind", data.wind.speed);
  console.log("humidity", data.main.humidity);
  console.log("pressure", data.main.pressure);

  $("#location").html(data.name);
  $("#time").html(convertUnixTime(data.dt));
  $("#icon").removeClass().addClass("wi " + getIcon(data.weather[0].icon));
  $("#temp").html(kelvinToCelsius(data.main.temp));
  $("#description").html(capitaliseFirstLetter(data.weather[0].description));
}

function convertUnixTime(unix) {
  var time = new Date(unix * 1000);
  return time.toLocaleTimeString([],{hour: "2-digit", minute: "2-digit"});
}

function getIcon(id) {
  var icon = {
    "01d": "wi-day-sunny",
    "01n": "wi-night-clear",
    "02d": "wi-day-cloudy",
    "02n": "wi-night-alt-cloudy",
    "03d": "wi-cloud",
    "03n": "wi-cloud",
    "04d": "wi-cloudy",
    "04n": "wi-cloudy",
    "09d": "wi-showers",
    "09n": "wi-showers",
    "10d": "wi-day-rain",
    "10n": "wi-night-alt-rain",
    "11d": "wi-thunderstorm",
    "11n": "wi-thunderstorm",
    "13d": "wi-snow",
    "13n": "wi-snow",
    "50d": "wi-fog",
    "50n": "wi-fog"
  }
  return icon[id];
}

function kelvinToCelsius(k) {
  return Math.round(k - 273.15)
}

function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

$(document).ready(function() {
  ajax().done(getData).fail(function() {
    console.log("Fail");
  });
});