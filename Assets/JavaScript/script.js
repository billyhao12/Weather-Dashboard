console.log('Start weather app');

var cacheKey = 'knownCities';

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

    var queryURL = 'http://api.openweathermap.org/data/2.5/weather?' + queryParams;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function(response) {

        console.log(response);

        displayWeather(response);
        fetchUV(response.coord);


    });

}

// Display the city data
function displayWeather(cityData) {

}

// Fetch UV from the API
function fetchUV(coords) {
    var queryParams = $.param({
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'http://api.openweathermap.org/data/2.5/uvi?' + queryParams;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayUVData);

}

// Display the city data
function displayUVData(cityData) {

}

// Fetch forecast from the API
function fetchForecast(city) {
    var queryParams = $.param({
        appid: '08380159329a3e38fda792a63e0fc216'
    });

    var queryURL = 'http://api.openweathermap.org/data/2.5/forecast?' + queryParams;

    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(displayForecast);


}

// Display the city data
function displayForecast(forecastData) {

}

function addNewCity(city) {

    if(cities.indexOf(city) === -1) {

        console.log('Add new city');

        cities.push(city);
        localStorage.setItem(cacheKey, JSON.stringify(cities));

    }
}

searchWeather('Santa Rosa');