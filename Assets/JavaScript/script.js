var cacheKey = 'knownCities';
var city = '';

// Selecting elements for today's weather
var currentWeatherTitle = $('#currentWeatherTitle'),
    currentIcon = $('#currentIcon'),
    currentTemp = $('#currentTemp'),
    currentHumid = $('#currentHumid'),
    currentWindSpeed = $('#currentWindSpeed'),
    currentUV = $('#currentUV');

var currentUVNum = $('<span></span>');

// Get starting data from local storage if present
var cities = JSON.parse(localStorage.getItem(cacheKey));

if (!cities) {
    cities = [];
}

// Starting point
function searchWeather(city) {

    addNewCity(city);

    fetchWeather(city);
    fetchForecast(city);

}

// Fetch weather from the API
function fetchWeather(city) {
    var queryParams = $.param({
        q: city,
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?' + queryParams + '&units=imperial';

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        displayWeather(response);
        fetchUV(response.coord);

    });

}

// Display the city data
function displayWeather(cityData) {

    clearWeather();

    currentWeatherTitle.text(cityData.name + ' (' + moment().format('l') + ')' + ' ');
    $('#cityWeather').prepend(currentWeatherTitle);

    currentIcon.attr('src', 'http://openweathermap.org/img/w/' + cityData.weather[0].icon + '.png');
    currentWeatherTitle.append(currentIcon);

    currentTemp.text('Temperature: ' + cityData.main.temp + ' °F');
    currentHumid.text('Humidity: ' + cityData.main.humidity + '%');
    currentWindSpeed.text('Wind Speed: ' + cityData.wind.speed + ' MPH');

}

function clearWeather() {
    currentWeatherTitle.text('');
    currentIcon.val('');
}

// Fetch UV from the API
function fetchUV(coords) {
    var queryParams = $.param({
        appid: '08380159329a3e38fda792a63e0fc216',
        lat: coords.lat,
        lon: coords.lon
    });

    var queryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + queryParams;

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayUVData);

}

// Display the city data
function displayUVData(cityData) {

    currentUVNum.text(cityData.value);
    currentUV.append(currentUVNum);

    if (cityData.value <= 2) {
        currentUVNum.css('background-color', 'green');

    } else if (cityData.value <= 5) {
        currentUVNum.css('background-color', 'yellow');

    } else if (cityData.value <= 7) {
        currentUVNum.css('background-color', 'orange');

    } else if (cityData.value <= 10) {
        currentUVNum.css('background-color', 'red');

    } else {
        currentUVNum.css('background-color', 'purple');
    }

}

// Fetch forecast from the API
function fetchForecast(city) {
    var queryParams = $.param({
        q: city,
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'http://api.openweathermap.org/data/2.5/forecast?' + queryParams + '&units=imperial';

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayForecast);
}

// Display the city data
function displayForecast(forecastData) {
    console.log(forecastData);
}

function addNewCity(city) {

    if (cities.indexOf(city) === -1) {

        cities.push(city);
        localStorage.setItem(cacheKey, JSON.stringify(cities));

    }
}

// Passes user's input into the searchWeather function
$('form').submit(function (event) {
    event.preventDefault();
    city = $('input').val();

    searchWeather(city);
})