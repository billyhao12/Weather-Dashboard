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
currentUVNum.css("color", "white");

// Get starting data from local storage if present
var cities = JSON.parse(localStorage.getItem(cacheKey));

if (!cities) {
    cities = [];
} else {
    fetchWeather(cities[(cities.length) - 1]);
}

renderHistory();

// Displays a history of previous search terms.
// Clicking on a term brings up the city's current weather and forecast.
function renderHistory() {

    cities.forEach(function(item) {
        var newItem = $('<li>' + item + '</li>');
        $('#history').prepend(newItem);

        newItem.on('click', function() {
            fetchWeather(item);
        })
    })

}

function clearHistory() {
    $('#history').empty();
}

// Passes user's input into the searchWeather function
$('form').submit(function (event) {
    event.preventDefault();
    city = $('input').val();

    searchWeather(city);

    clearHistory();
    renderHistory();
})

// Starting point
function searchWeather(city) {

    addNewCity(city);

    fetchWeather(city);

}

function addNewCity(city) {

    if (cities.indexOf(city) === -1) {

        cities.push(city);
        localStorage.setItem(cacheKey, JSON.stringify(cities));

    }
}

// Fetch weather from the API
function fetchWeather(city) {

    console.log(city);

    var queryParams = $.param({
        q: city,
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?' + queryParams + '&units=imperial';

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {

        displayWeather(response);
        fetchUV(response.coord);
        fetchForecast(response.coord);

    });

}

// Display the city data
function displayWeather(cityData) {

    clearWeather();

    currentWeatherTitle.text(cityData.name + ' (' + moment().format('l') + ')' + ' ');
    $('#cityWeather').prepend(currentWeatherTitle);

    currentIcon.attr('src', 'https://openweathermap.org/img/w/' + cityData.weather[0].icon + '.png');
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

    var queryURL = 'https://api.openweathermap.org/data/2.5/uvi?' + queryParams;

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
function fetchForecast(coords) {
    var queryParams = $.param({
        lat: coords.lat,
        lon: coords.lon,
        exclude: 'current,minutely,hourly',
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?' + queryParams + '&units=imperial';

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayForecast);
}

// Display the city data
function displayForecast(forecastData) {

    for (var i = 1; i < 6; i++) {
        $('#card-title-' + i).text(moment().add(i, 'days').format('l'));
        $('#icon-' + i).attr('src', 'https://openweathermap.org/img/w/' + forecastData.daily[i].weather[0].icon + '.png');

        $('#temp-' + i).text('Temp: ' + forecastData.daily[i].temp.max + ' °F');
        $('#humid-' + i).text('Humidity: ' + forecastData.daily[i].humidity + '%');
    }
}
