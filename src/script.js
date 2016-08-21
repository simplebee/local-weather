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
  var consoleMsg = "OpenWeatherMap: Fail";
  var alertMsg = "Unable to retreive the current weather";

  return weatherApi(data).done(setWeather).fail(handleError(consoleMsg, alertMsg));
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
  var key = [
    "name",
    "sys.country",
    "id",
    "weather.0.icon",
    "main.temp",
    "weather.0.description",
    "wind.speed",
    "main.humidity",
    "main.pressure"
  ];
  
  if (validateApiData(data, key)) {

    var city = data.name;
    var country = data.sys.country;
    var cityID = data.id;
    var icon = convertIcon(data.weather[0].icon);
    var temp = Math.round(data.main.temp);
    var description = capitaliseFirstLetter(data.weather[0].description);
    var speed = msToMph(data.wind.speed);
    var humidity = data.main.humidity;
    var pressure = Math.round(data.main.pressure);

    console.log("OpenWeatherMap: Success");

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
    removeAlert();
    
    if ($("#container-weather").is(":hidden")) {
      $("#container-weather").show();
    }
  } else {
    console.log("OpenWeatherMap: Fail");
    showAlert("Unable to retreive the current weather");
  }
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
  var consoleMsg = "ip-api: Fail";
  var alertMsg = "Unable to retreive your current locaton";

  return geoApi().done(getLonLat).fail(handleError(consoleMsg, alertMsg));
}

function getLonLat(data) {
  var latCoord = data.lat;
  var lonCoord = data.lon;

  console.log("ip-api: Success");

  var location = {
    lat: latCoord,
    lon: lonCoord
  };
  weatherDoneFail(weatherAjaxData(location));
}

// Checks an array of keys
// Keys given as a dot-separated string "key1.key2.key3"
function validateApiData(obj, arr) {
  for (var i = 0; i < arr.length; i++) {
    if (!checkObj(obj, arr[i])) {
      return false;
    }
  }
  return true;
}

// Checks existance of keys in a nested object
// To avoid getting typeerror for deep nested objects
// Keys given as a dot-separated string "key1.key2.key3"
function checkObj(obj, key) {
  var keyArray = key.split(".");
  for (var i = 0; i < keyArray.length; i++) {
    if (!obj || !obj.hasOwnProperty(keyArray[i])) {
      return false;
    } else {
      obj = obj[keyArray[i]];
    }
  }
  return true;
}

function getSearch(event) {
  var $inputVal = $.trim($("input").val());

  if (validateInput($inputVal)) {
    var location = {
      q: $inputVal
    };
    weatherDoneFail(weatherAjaxData(location));
  } else {
    var alertMsg = "Invaild search";
    showAlert(alertMsg);
  }
  event.preventDefault();
}

function validateInput(input) {
  var regex = /^[A-Za-z-, ]+$/;
  
  if (regex.test(input)) {
    return true;
  } else {
    return false;
  }
}

// Create closure in handleError function, to pass additional parameters
// Returns .fail callback
function handleError(consoleMsg, alertMsg) {
  return function(jqXHR, textStatus, errorThrown) {
    console.log(consoleMsg);
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);

    showAlert(alertMsg);

    if ($("#info-temp").is(":empty")) {
      $("#container-weather").hide();
    }
  };
}

// Show only 1 alert message at a time
function showAlert(str) {
  var alertPopup =
    '<div class="alert alert-danger alert-dismissible">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
      '</button>' +
      '<p>Sorry! ' + str + ', please try again</p>' +
    '</div>';

  removeAlert();
  $("nav").after(alertPopup);
}

function removeAlert() {
  var $alert = $(".alert");
  if ($alert.length) {
    $alert.remove();
  }
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
  return Math.round(ms * 3600 / 1609.34);
}

function capitaliseFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

$(document).ready(function() {
  var location = savedSessionLocation();
  weatherDoneFail(weatherAjaxData(location));
  $("#btn-location").on("click", geoDoneFail);
  $("form").on("submit", getSearch);
  $("#btn-toggle").on("change", convertTemp);
});