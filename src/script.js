function ajax(lat, lon, city) {
  return $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather",
    data: {
      lat: lat,
      lon: lon,
      q: city,
      units: "metric",
      APPID: openWeatherMap.apikey
    },
    type: "GET",
    datatype: "json"
  });
}

function ajaxDoneFail(lat, lon, city) {
  return ajax(lat, lon, city).done(getData).fail(function() {
    console.log("Ajax: Fail");
  });
}

function getData(data) {
  var city = data.name;
  var icon = getIcon(data.weather[0].icon);
  var temp = Math.round(data.main.temp);
  var description = capitaliseFirstLetter(data.weather[0].description);
  var speed = data.wind.speed;
  var humidity = data.main.humidity;
  var pressure = data.main.pressure;

  console.log("Ajax: Success");
  console.log(data);
  console.log("Location:", city);
  console.log("Icon:", icon);
  console.log("Temp:", temp);
  console.log("Description:", description);
  console.log("Wind:", speed);
  console.log("Humidity:", humidity);
  console.log("Pressure:", pressure);

  $("#location").html(city);
  $("#icon").removeClass().addClass("wi " + icon);
  $("#temp").html(temp);
  $("#description").html(description);
  $("#wind").html(speed);
  $("#humidity").html(humidity);
  $("#pressure").html(pressure);
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

function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function geoSuccess(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  console.log("Geolocation: Success");
  console.log("Lat:", lat);
  console.log("Lon:", lon);

  ajaxDoneFail(lat, lon);
}

function geoError(error) {
  console.log("Geolocation error(" + error.code + "): " + error.message);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    console.log("Geolocation is not supported")
  }
}

function getSearch() {
  var input = $("input").val();
  ajaxDoneFail("", "", input);
}

$(document).ready(function() {
  ajaxDoneFail("", "", "london");
  $("#getlocation").on("click", getLocation);
  $("#searchbutton").on("click", getSearch);
});