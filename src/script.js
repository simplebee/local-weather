function ajax(data) {
  return $.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather",
    data: data,
    type: "GET",
    datatype: "json"
  });
}

function ajaxDoneFail(data) {
  return ajax(data).done(getData).fail(function() {
    console.log("Ajax: Fail");
  });
}

function extendAjaxData(obj) {
  var src = {
    units: "metric",
    APPID: openWeatherMap.apikey
  };
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      src[key] = obj[key];
    }
  }
  return src;
}

function getData(data) {
  var cityCountry = data.name + " " + data.sys.country;
  var cityID = data.id;
  var icon = getIcon(data.weather[0].icon);
  var temp = Math.round(data.main.temp);
  var description = capitaliseFirstLetter(data.weather[0].description);
  var speed = msToMph(data.wind.speed);
  var humidity = data.main.humidity;
  var pressure = Math.round(data.main.pressure);

  console.log("Ajax: Success");
  console.log(data);
  console.log("Location:", cityCountry);
  console.log("Icon:", icon);
  console.log("Temp:", temp);
  console.log("Description:", description);
  console.log("Wind:", speed);
  console.log("Humidity:", humidity);
  console.log("Pressure:", pressure);

  $("#location").html(cityCountry);
  $("#icon").removeClass().addClass("wi " + icon);
  $("#temp").html(temp);
  $("#description").html(description);
  $("#wind").html(speed);
  $("#humidity").html(humidity);
  $("#pressure").html(pressure);

  sessionStorage.setItem("tempMetric", temp);
  sessionStorage.setItem("cityID", cityID);
  convertTemp();
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
  var latCoord = position.coords.latitude;
  var lonCoord = position.coords.longitude;

  console.log("Geolocation: Success");
  console.log("Lat:", latCoord);
  console.log("Lon:", lonCoord);

  var obj= {
    lat: latCoord,
    lon: lonCoord
  };

  ajaxDoneFail(extendAjaxData(obj));
}

function geoError(error) {
  console.log("Geolocation error(" + error.code + "): " + error.message);
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
  } else {
    console.log("Geolocation is not supported");
  }
}

function getSearch(event) {
  var $searchInput = $("input").val();
  var obj = {
    q: $searchInput
  };
  ajaxDoneFail(extendAjaxData(obj));
  event.preventDefault();
}

function metricToImperial(temp) {
  return Math.round(temp * 1.8 + 32);
}

function convertTemp() {
  var $toggle = $("#toggle");
  var tempMetric = sessionStorage.tempMetric;
  if ($toggle.is(":checked")) {
    $("#temp").html(tempMetric);
  } else {
    $("#temp").html(metricToImperial(tempMetric));
  }
}

function msToMph(ms) {
  //3600s = 1hr
  //1609.34m = 1mile
  return Math.round(ms * 3600 / 1609.34)
}

function savedSessionLocation() {
  var cityID = sessionStorage.cityID;
  if (cityID == undefined) {
    return {q: "london"};
  } else {
    return {id: cityID};
  }
}

$(document).ready(function() {
  var obj = savedSessionLocation();
  ajaxDoneFail(extendAjaxData(obj));
  $("#getlocation").on("click", getLocation);
  $("form").on("submit", getSearch);
  $("#toggle").on("change", convertTemp);
});