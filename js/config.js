// Configuration file for WeatherCast
// For GitHub Pages deployment - API key should be provided by users

const CONFIG = {
    // OpenWeatherMap API Key
    // Users can provide this via URL parameter: ?api_key=YOUR_KEY
    // or by storing it in localStorage
    OPENWEATHER_API_KEY: getApiKey(),
    
    // API URLs (using HTTPS for GitHub Pages compatibility)
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_API_URL: 'https://api.openweathermap.org/geo/1.0'
};

function getApiKey() {
    // Check URL parameters first
    const urlParams = new URLSearchParams(window.location.search);
    const urlApiKey = urlParams.get('api_key');
    if (urlApiKey) {
        // Store in localStorage for future use
        localStorage.setItem('weatherApiKey', urlApiKey);
        return urlApiKey;
    }
    
    // Check localStorage
    const storedApiKey = localStorage.getItem('weatherApiKey');
    if (storedApiKey) {
        return storedApiKey;
    }
    
    // Option 1: Use environment variable (for Netlify, Vercel, etc.)
    if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_WEATHER_API_KEY) {
        return process.env.REACT_APP_WEATHER_API_KEY;
    }
    
    // Option 2: For GitHub Pages with a fallback demo key (rate limited)
    // This is a demo key with limited usage - users should provide their own
    const demoKey = 'demo_key_please_get_your_own_from_openweathermap';
    
    // Option 3: Return empty string - will prompt user to enter API key
    return '';
}

// Function to set API key programmatically
function setApiKey(apiKey) {
    localStorage.setItem('weatherApiKey', apiKey);
    CONFIG.OPENWEATHER_API_KEY = apiKey;
    
    // Update the global config
    if (window.weatherApp) {
        window.weatherApp.apiKey = apiKey;
    }
}