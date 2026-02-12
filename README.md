# Atmosphere | Premium Weather App

**Project URL**: [[View Live Project](https://example.com/weather-app)](https://roadmap.sh/projects/weather-app)

A modern, responsive weather application built with pure HTML, CSS, and JavaScript. It features a premium glassmorphism design, smooth animations, and integration with the Visual Crossing Weather API.

![Weather App Preview](https://via.placeholder.com/800x400?text=Atmosphere+Weather+App)

## Features

- **Premium UI/UX**: Glassmorphism aesthetic with dynamic gradients and Lucide icons.
- **Current Weather**: Real-time temperature, condition, wind, humidity, and rain chance.
- **24-Hour Forecast**: Scrollable hourly forecast view.
- **Geolocation**: Auto-detects user location (with permission).
- **Search**: Search for weather in any city globally.
- **Mock Data Mode**: Works out-of-the-box for testing without an API key.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.

## Setup & Usage

### 1. Run the App

Simply open `index.html` in any modern web browser. No server or installation required!

### 2. API Configuration (Optional)

By default, the app runs in **Mock Data Mode**, simulating weather data for "Cairo" or any searched city. To use **Real Live Data**:

1.  Get a free API Key from [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api).
2.  Open `script.js` in a text editor.
3.  Replace the placeholder key on line 7:

```javascript
// Before
const API_KEY = "YOUR_VISUAL_CROSSING_API_KEY";

// After
const API_KEY = "YOUR_ACTUAL_ABC123_KEY_HERE";
```

4.  Refresh the page (`index.html`).

## Technologies Used

- **HTML5**: Semantic structure.
- **CSS3**: Custom properties (variables), Flexbox, Grid, CSS Animations, Glassmorphism effects.
- **JavaScript (ES6+)**: `fetch` API, DOM manipulation, Async/Await.
- **Lucide Icons**: Lightweight, beautiful SVG icons.
- **Google Fonts**: "Outfit" typeface.

## Project Structure

```
/
├── index.html      # Main HTML structure
├── style.css       # All styles and animations
├── script.js       # Game logic and API handling
└── README.md       # Project documentation
```

## Credits

Designed and developed by [Your Name/AI Assistant].
Powered by Visual Crossing Weather API.
