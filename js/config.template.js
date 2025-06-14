// Configuration template file
// Copy this file to config.js and add your actual API keys

const CONFIG = {
    // OpenWeatherMap API Key - Get one free at https://openweathermap.org/api
    OPENWEATHER_API_KEY: 'YOUR_API_KEY_HERE',
    
    // API URLs
    WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_API_URL: 'http://api.openweathermap.org/geo/1.0'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}