var API_ENDPOINT = "https://api.darksky.net/forecast/"
var API_KEY = ""; // TODO: enter API key.

var LATITUDE_SELECTOR = "#userLatitude";
var LONGITUDE_SELECTOR = "#userLongitude";

function getWeather() {
    var latitude = $(LATITUDE_SELECTOR).val();
    var longitude = $(LONGITUDE_SELECTOR).val();

    var url = getUrl(latitude, longitude);
    $.getJSON(url, showWeather);
}

function getUrl(latitude, longitude, units) {

    return API_ENDPOINT + API_KEY + "/" + latitude + "," + longitude + "?exclude=daily&blocks=currently,hourly,alerts,flags&units=" + units + "&callback=?";
}

function showWeather(json) {
    var skycons = new Skycons({
        "color": "#292b2c",
        "resizeClear": true
    });

    // 1. icon
    skycons.set("weather-icon", json.currently.icon);
    skycons.play();

    // 2. summary
    $("#weather-summary").text(json.currently.summary);

    // 3. location
    var latitude = $(LATITUDE_SELECTOR).val();
    var longitude = $(LONGITUDE_SELECTOR).val();
    $("#location").text("Coordinates: " + latitude + ", " + longitude);

    // 4. city
    // TODO

    // 5. temperature
    var temperature = Math.round(json.currently.temperature);
    $("#temperature").text(temperature);
    if (json.flags.units === "us") {
        $("#fahrenheit").addClass("inactive-link");
        $("#celsius").removeClass("inactive-link");

    } else {
        $("#celsius").addClass("inactive-link");
        $("#fahrenheit").removeClass("inactive-link");
    }

    $("#celsius").on("click", function () {
        $("#celsius").addClass("inactive-link");
        $("#fahrenheit").removeClass("inactive-link");
        var temperature = $("#temperature").text();
        $("#temperature").text(Math.round((temperature - 32) * 5 / 9));
    });

    $("#fahrenheit").on("click", function () {
        $("#fahrenheit").addClass("inactive-link");
        $("#celsius").removeClass("inactive-link");
        var temperature = $("#temperature").text();
        $("#temperature").text(Math.round(temperature * 9 / 5 + 32));

    });

    $("#temperature-units").css("display", "inline");

    // 6. wind speed
    $("#wind").text("Wind: " + Math.round(json.currently.windSpeed));

    var windUnits;
    switch (json.flags.units) {
        case "si":
            windUnits = "m/s";
            break;
        case "uk2":
            windUnits = "mph";
            break;
        case "ca":
            windUnits = "km/h";
            break;
        case "us":
            windUnits = "mph";
            break;
    }

    $("#wind-units").text(" " + windUnits);


    // 7. precipitation
    $("#precipitation").text("Precipitation: " + Math.round(json.currently.precipProbability * 100) + "%");

    // 8. humidity
    $("#humidity").text("Humidity: " + Math.round(json.currently.humidity * 100) + "%");

    // 9. background
    $("body").css("background-image", "url(img/" + json.currently.icon + ".jpg)")

}

function downloadWeatherData(latitude, longitude) {
    var url = getUrl(latitude, longitude, "auto");
    $.getJSON(url, showWeather);
}

/*
    Start function
*/
function getWeather() {
    var success = function (position) {
        var coords = position.coords;
        var latitude = coords.latitude;
        var longitude = coords.longitude;

        $(LATITUDE_SELECTOR).val(latitude);
        $(LONGITUDE_SELECTOR).val(longitude);

        downloadWeatherData(latitude, longitude);

    };

    var error = function (err) {
        alert("Can't get user location");
    };

    var latitude = $(LATITUDE_SELECTOR).val();
    var longitude = $(LONGITUDE_SELECTOR).val();

    if (!latitude && !longitude && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        downloadWeatherData(latitude, longitude);
    }
}
