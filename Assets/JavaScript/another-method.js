console.log('Start weather app');

var cacheKey = 'weatherByCity';

// Get my starting data, try to load from local storage
var citiesStore = JSON.parse(localStorage.getItem(cacheKey));

if (!citiesStore) {

    citiesStore = {};

}

// Display the city's data
function renderCityData(city) {

    console.log(city);

    // Try to get the city data
    var cityData = getCityData(city);

    if (!cityData) {

        console.log('Didn\'t get data, exiting render function');

        // Exit function
        return;

    }

    // Render the data to the html
    console.log( 'Got the city data, render html' )

}

// Get the city's data
function getCityData(city) {

    // If I have existing city data
    if(citiesStore[city]) {

        // Return that data
        return citiesStore[city];

    } else {

        // Otherwise go fetch it from the API
        fetchCityData(city);

        // Return, failed to get data
        return false;
    }

}


// Fetch new data from the API if we don't have it
function fetchCityData(city) {

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

        // Save our response data to our storage object
        citiesStore[city] = {
            name: response.name,
            temp: response.main.temp
        };

        localStorage.setItem(cacheKey, JSON.stringify(citiesStore));
        
        renderCityData(city);
    });

}

renderCityData( 'Santa Rosa' );

