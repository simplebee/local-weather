// Uses openweathermap api, gets current weather
function weatherApi(data) {
  return $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather",
    data: data,
    type: "GET",
    datatype: "json"
  });
}

function weatherDoneFail(data) {
  return weatherApi(data).done(setWeather).fail(function(jqXHR, textStatus, errorThrown) {
    console.log("Ajax: Fail");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);

    var message = "We are unable to retreive the current weather";
    showErrorAlert(message);
  });
}

// Merges 2 objects into 1 object
// Creates a data object for openweathermap ajax request
function weatherAjaxData(src) {
  var obj = {
    units: "metric",
    APPID: openWeatherMap.apikey
  };
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      obj[key] = src[key];
    }
  }
  return obj;
}

function setWeather(data) {
  var city = data.name;
  var country = data.sys.country;
  var cityID = data.id;
  var icon = convertIcon(data.weather[0].icon);
  var temp = Math.round(data.main.temp);
  var description = capitaliseFirstLetter(data.weather[0].description);
  var speed = msToMph(data.wind.speed);
  var humidity = data.main.humidity;
  var pressure = Math.round(data.main.pressure);

  console.log("Ajax: Success");
  console.log(data);
  console.log("City:", city);
  console.log("Country:", country);
  console.log("City ID:", cityID);
  console.log("Icon:", icon);
  console.log("Temp:", temp);
  console.log("Description:", description);
  console.log("Wind:", speed);
  console.log("Humidity:", humidity);
  console.log("Pressure:", pressure);

  $("#info-city").html(city);
  $("#info-country").html(country);
  $("#info-icon").removeClass().addClass("wi " + icon);
  $("#info-temp").html(temp);
  $("#info-description").html(description);
  $("#info-wind").html(speed);
  $("#info-humidity").html(humidity);
  $("#info-pressure").html(pressure);

  sessionStorage.setItem("tempMetric", temp);
  sessionStorage.setItem("cityID", cityID);

  convertTemp();
}

// Uses ip-api, with ip can get latitude and longitude
function geoApi() {
  return $.ajax({
    url: "http://ip-api.com/json",
    type: "GET",
    datatype: "json"
  });
}

// Adblock extensions can cause ajax to fail
function geoDoneFail() {
  return geoApi().done(getLonLat).fail(function(jqXHR, textStatus, errorThrown) {
    console.log("Geo: Fail");
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);

    var message = "We are unable to retreive your current locaton";
    showErrorAlert(message);
  });
}

function getLonLat(data) {
  var latCoord = data.lat;
  var lonCoord = data.lon;

  console.log("Geo: Success");
  console.log(data);
  console.log("Lat:", latCoord);
  console.log("Lon:", lonCoord);

  var location = {
    lat: latCoord,
    lon: lonCoord
  };
  weatherDoneFail(weatherAjaxData(location));
}

function getSearch(event) {
  var $inputVal = $("input").val();
  var location = {
    q: $inputVal
  };
  weatherDoneFail(weatherAjaxData(location));
  event.preventDefault();
}

// Persistent location on browser refresh
function savedSessionLocation() {
  var cityID = sessionStorage.cityID;
  if (cityID == undefined) {
    return {q: "london"};
  } else {
    return {id: cityID};
  }
}

// Converts openweathermap icons to "weather icons"
// https://erikflowers.github.io/weather-icons/
function convertIcon(id) {
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

// Ajax gets metric temp, checks toggle status and adjust units
function convertTemp() {
  var $btnToggle = $("#btn-toggle");
  var tempMetric = sessionStorage.tempMetric;
  if ($btnToggle.is(":checked")) {
    $("#info-temp").html(tempMetric);
  } else {
    $("#info-temp").html(celsiusToFahrenheit(tempMetric));
  }
}

// F = C * 1.8 + 32
function celsiusToFahrenheit(c) {
  return Math.round(c * 1.8 + 32);
}

// 3600 sec = 1 hr
// 1609.34 meter = 1 mile
function msToMph(ms) {
  return Math.round(ms * 3600 / 1609.34)
}

function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function showErrorAlert(str) {
  var $alert = $(".alert");
  var alertMessage = '<div class="alert alert-danger alert-dismissible">' +
    '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '    <span aria-hidden="true">&times;</span>' +
    '  </button>' +
    '  <p>Sorry!</p>' +
    '  <p>' + str + '</p>' +
    '</div>';

  if ($alert.length) {
    $alert.remove();
  }

  $("nav").after(alertMessage);
}

$(document).ready(function() {
  var location = savedSessionLocation();
  weatherDoneFail(weatherAjaxData(location));
  $("#btn-location").on("click", geoDoneFail);
  $("form").on("submit", getSearch);
  $("#btn-toggle").on("change", convertTemp);
});