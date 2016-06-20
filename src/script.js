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
  console.log("time", data.dt);

  console.log("weather icon",data.weather[0].icon);
  console.log("current temp", data.main.temp);

  console.log("weather description", data.weather[0].description);

  console.log("wind", data.wind.speed);
  console.log("rain", data.rain["3h"]);
  console.log("humidity", data.main.humidity);
}

ajax().done(getData).fail(function() {
  console.log("Fail");
});