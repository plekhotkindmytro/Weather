var API_ENDPOINT = "https://api.darksky.net/forecast/"
var API_KEY = "";

var LATITUDE_SELECTOR = "#userLatitude";
var LONGITUDE_SELECTOR = "#userLongitude";

function getWeather() {
    var latitude = $(LATITUDE_SELECTOR).val();
    var longitude = $(LONGITUDE_SELECTOR).val();

    var url = getUrl(latitude, longitude);
    $.getJSON(url, showWeather);
}

function getUrl(latitude, longitude) {

    return API_ENDPOINT + API_KEY + "/" + latitude + "," + longitude;
}

function showWeather(json) {
    $("body").append(json);
}

function downloadWeatherData(latitude, longitude) {
    var url = getUrl(latitude, longitude);
    $.getJSON(url, showWeather);
}

/*
    Start function
*/
function getWeather() {
    var success = function (position) {
        var coords = position.coords;
        var latitude = coords.latitude;
        var longitude = coords.longituge;

        $(LATITUDE_SELECTOR).val(latitude);
        $(LONGITUDE_SELECTOR).val(longitude);

        downloadWeatherData(latitude, longitude);

    };

    var error = function (err) {
        alert("Can't get user location");
        console.warn("ERROR(${err.code}): ${err.message}");
    };

    var latitude = $(LATITUDE_SELECTOR).val();
    var longitude = $(LONGITUDE_SELECTOR).val();

    if (!latitude && !longitude && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        downloadWeatherData(latitude, longitude);
    }
}
