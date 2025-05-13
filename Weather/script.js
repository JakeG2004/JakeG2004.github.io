/*import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();*/

// Define the API url
const API_KEY = "8aef96718d504c27a6980827251105";
const apiBaseURL = `https://api.weatherapi.com/v1/forecast.json`;

// Get the source elements from the HTML page
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');

// Get the display elements from the HTML page
const tempElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weatherIcon');
const forecastItems = document.querySelectorAll('.forecast-item');

// Hide the image
weatherIconElement.style.visibility = 'hidden';

fetchWeather("Spokane");

searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if(location) {
        console.log("Got location!");
        fetchWeather(location);
    }
})

function fetchWeather(location) {
    const url = `${apiBaseURL}?key=${API_KEY}&q=${location}&days=6`

    // Make a GET request
    fetch(url)
        .then(response => {
            if(!response.ok) {
                throw new Error('Network response was NOT ok!!!!!');
            }

            return response.json();
        })
        .then(data => {
            // Set the text
            locationElement.textContent = `${data.location.name}, ${data.location.region}`;
            tempElement.textContent = `${data.current.temp_f}° F`;
            descriptionElement.textContent = `${data.current.condition.text}`;
            windSpeedElement.textContent = `${data.current.wind_mph} MPH ${data.current.wind_dir}`;

            // Set the icon
            weatherIconElement.src = `https:${data.current.condition.icon}`;
            weatherIconElement.style.visibility = 'visible';

            // Set the forecast
            for(let i = 0; i < 5; i++) {
                // Get forecast data for the day
                let dayData = data.forecast.forecastday[i + 1];

                // Set day name (e.g., Mon, Tue, etc.)
                const date = new Date(dayData.date);
                date.setDate(date.getDate() + 1);
                const options = { weekday: 'short' }; // returns "Mon", "Tue", etc.
                const dayName = date.toLocaleDateString(undefined, options);

                // Set the day name
                forecastItems[i].querySelector('h3').textContent = dayName;

                // Set the images
                forecastItems[i].querySelector('img.forecast-icon').src = `https:${dayData.day.condition.icon}`;

                // Set the low and high temperatures
                forecastItems[i].querySelector('p.forecast-temp').textContent = `${dayData.day.mintemp_f} / ${dayData.day.maxtemp_f}`;
            }

        })
        .catch(error => {
            console.error('Error:', error);
        });
}


/*
https://www.freecodecamp.org/news/make-api-calls-in-javascript/

https://www.weatherapi.com/my/

https://www.weatherapi.com/docs/
*/
