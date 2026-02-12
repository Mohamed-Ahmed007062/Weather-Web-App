/**
 * Weather App Logic
 * Uses Visual Crossing Weather API
 */

// CONFIGURATION
const API_KEY = 'YOUR_VISUAL_CROSSING_API_KEY'; // Replace with key or leave as is for mock data
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';

// Mock Data for demonstration
const MOCK_DATA = {
    resolvedAddress: "Cairo, Egypt",
    currentConditions: {
        temp: 24,
        conditions: "Partially cloudy",
        windspeed: 12,
        humidity: 45,
        preciprob: 0,
        datetime: "14:00:00"
    },
    days: [
        {
            tempmax: 28,
            tempmin: 19,
            hours: Array.from({length: 24}, (_, i) => ({
                datetime: `${i}:00:00`,
                temp: 20 + Math.random() * 10,
                conditions: i > 6 && i < 18 ? "Sunny" : "Clear"
            }))
        },
        {
            tempmax: 29,
            tempmin: 20,
            hours: Array.from({length: 24}, (_, i) => ({
                datetime: `${i}:00:00`,
                temp: 21 + Math.random() * 8,
                conditions: "Sunny"
            }))
        }
    ]
};

// DOM ELEMENTS
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const refreshBtn = document.getElementById('refreshBtn');
const currentWeatherSection = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// EVENT LISTENERS
searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) fetchWeather(location);
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) fetchWeather(location);
    }
});

geoBtn.addEventListener('click', getLocation);
refreshBtn.addEventListener('click', () => {
    const currentCity = document.getElementById('cityName').textContent;
    if (currentCity && currentCity !== '--') fetchWeather(currentCity);
});

// INIT
function init() {
    // Load default mock/real data
    fetchWeather('Cairo'); 
}

// FUNCTIONS

function getLocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeather(`${latitude},${longitude}`);
            },
            (error) => {
                showError('Location access denied. Please search manually.');
            }
        );
    } else {
        showError('Geolocation is not supported by this browser.');
    }
}

async function fetchWeather(location) {
    showLoading();

    // Use Mock Data if Key is missing
    if (API_KEY === 'YOUR_VISUAL_CROSSING_API_KEY') {
        setTimeout(() => {
            console.warn('Using Mock Data: API Key not set');
            // Simulate changing city name for mock
            const mock = {...MOCK_DATA};
            mock.resolvedAddress = location.charAt(0).toUpperCase() + location.slice(1); 
            renderWeather(mock);
        }, 1000); // Fake delay
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}${location}?unitGroup=metric&key=${API_KEY}&contentType=json`, 
            { mode: 'cors' }
        );

        if (!response.ok) {
            throw new Error('City not found or API error');
        }

        const data = await response.json();
        renderWeather(data);

    } catch (err) {
        console.error(err);
        showError(err.message || 'Failed to fetch weather data');
    }
}

function renderWeather(data) {
    hideLoading();
    errorState.classList.add('hidden');
    
    // --- Render Current Weather ---
    document.getElementById('cityName').textContent = data.resolvedAddress.split(',')[0]; // Simple city name
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    const current = data.currentConditions;
    document.getElementById('temperature').textContent = Math.round(current.temp);
    document.getElementById('conditionText').textContent = current.conditions;
    document.getElementById('windSpeed').textContent = `${current.windspeed} km/h`;
    document.getElementById('humidity').textContent = `${Math.round(current.humidity)}%`;
    document.getElementById('rainChance').textContent = `${current.preciprob || 0}%`;

    // High/Low from the first day in forecast
    const today = data.days[0];
    document.getElementById('tempHigh').textContent = Math.round(today.tempmax);
    document.getElementById('tempLow').textContent = Math.round(today.tempmin);

    currentWeatherSection.classList.remove('hidden');

    // --- Render Hourly Forecast ---
    const hourlyTrack = document.getElementById('hourlyTrack');
    hourlyTrack.innerHTML = ''; // Clear previous

    // Animate forecast track entrance
    hourlyTrack.style.opacity = '0';
    setTimeout(() => {
        hourlyTrack.style.transition = 'opacity 0.5s ease';
        hourlyTrack.style.opacity = '1';
    }, 100);

    // Combine remaining hours of today and hours of tomorrow to get next 24h
    // Visual Crossing gives hours array for each day
    let next24Hours = [];
    
    // Get current hour index
    const currentHourStr = current.datetime.split(':')[0]; // "14:00:00" -> "14"
    const currentHourIndex = parseInt(currentHourStr, 10);

    // Add remaining hours from today
    next24Hours = [...today.hours.slice(currentHourIndex + 1)];

    // Add hours from tomorrow if needed to reach 24
    if (next24Hours.length < 24) {
        const tomorrow = data.days[1];
        const needed = 24 - next24Hours.length;
        next24Hours = [...next24Hours, ...tomorrow.hours.slice(0, needed)];
    }

    next24Hours.forEach(hour => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        // Format time (HH:00)
        const timeParts = hour.datetime.split(':');
        const timeDisplay = `${timeParts[0]}:${timeParts[1]}`;

        card.innerHTML = `
            <span class="forecast-time">${timeDisplay}</span>
            <!-- Icon placeholder: We could map conditions to icons here -->
            <span class="forecast-temp">${Math.round(hour.temp)}°</span>
            <span style="font-size: 0.7rem; opacity: 0.7">${hour.conditions}</span>
        `;
        
        hourlyTrack.appendChild(card);
    });

    forecastSection.classList.remove('hidden');
    
    // Re-initialize Lucide icons for injected content if any (not strictly needed for innerHTML if no <i> tags)
    // lucide.createIcons(); 
}

function showLoading() {
    loadingState.classList.remove('hidden');
    currentWeatherSection.classList.add('hidden');
    forecastSection.classList.add('hidden');
    errorState.classList.add('hidden');
}

function showError(msg) {
    loadingState.classList.add('hidden');
    currentWeatherSection.classList.add('hidden');
    forecastSection.classList.add('hidden');
    errorState.classList.remove('hidden');
    errorMessage.textContent = msg;
}

function hideLoading() {
    loadingState.classList.add('hidden');
}

// Start
init();
