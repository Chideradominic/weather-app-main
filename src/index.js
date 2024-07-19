import './style.css';
import rainImage from './images/rain.png';
import cloudsImage from './images/clouds.png';
import clearImage from './images/clear.png';
import humidityImage from './images/humidity.png'
import windImage from './images/wind.png';
document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('searchButton');
  const locationInput = document.getElementById('locationInput');
  const celsiusButton = document.getElementById('celsius');
  const fahrenheitButton = document.getElementById('fahrenheit');
  const imgHumidity = document.getElementById('humidityImage')
  const imgWind = document.getElementById('windImage')
  imgHumidity.src = humidityImage;
  imgWind.src = windImage;
  let currentUnit = 'metric';

  const fetchWeather = function(location) {
    const apiKey = '7WWNVYQA4D4AX7N94BX4CGHNM';
    const unit = currentUnit === 'metric' ? 'metric' : 'us';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&include=days&key=${apiKey}&contentType=json`;
    
    fetch(url, { mode: 'cors' })
      .then(response => response.json())
      .then(response => {
        if (!response || !response.days || response.days.length === 0) {
          throw new Error('No data returned from API');
        }
        // Update the DOM elements with the weather data
        document.getElementById('country').textContent = response.resolvedAddress;
        document.getElementById('countryDate').textContent = new Date(response.days[0].datetime).toDateString();
        document.getElementById('degreeOfWeather').textContent = `${response.days[0].temp}${currentUnit === 'metric' ? '°C' : '°F'}`;
        document.getElementById('weatherStats').textContent = response.days[0].conditions;
        document.getElementById('humidity').textContent = `${response.days[0].humidity}%`;
        document.getElementById('wind').textContent = `${response.days[0].windspeed}${currentUnit === 'metric' ? 'km/h' : 'mph'}`;
        // Update the weather icon based on the condition
        const weatherIcon = document.querySelector('.temperature img');
        if (response.days[0].conditions.toLowerCase().includes('rain')) {
          weatherIcon.src = rainImage;
        } else if (response.days[0].conditions.toLowerCase().includes('cloud')) {
          weatherIcon.src = cloudsImage;
        } else {
          weatherIcon.src = clearImage;
        }
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  searchButton.addEventListener('click', function() {
    const location = locationInput.value.trim();
    if (location) {
      fetchWeather(location);
    } else {
      console.error('Please enter a location');
    }
  });

  celsiusButton.addEventListener('click', function() {
    currentUnit = 'metric';
    const location = locationInput.value.trim();
    if (location) {
      fetchWeather(location);
    }
  });

  fahrenheitButton.addEventListener('click', function() {
    currentUnit = 'us';
    const location = locationInput.value.trim();
    if (location) {
      fetchWeather(location);
    }
  });

  // Initial fetch for a default location
  fetchWeather('New York');
});
