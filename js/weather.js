// Weather Application JavaScript
class WeatherApp {
    constructor() {
        // Load configuration from config.js
        this.apiKey = CONFIG.OPENWEATHER_API_KEY;
        this.apiUrl = CONFIG.WEATHER_API_URL;
        this.geoApiUrl = CONFIG.GEO_API_URL;
        this.isCelsius = true;
        this.currentWeatherData = null;
        this.forecastData = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.getCurrentLocationWeather();
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => {
            const city = document.getElementById('cityInput').value.trim();
            if (city) {
                this.searchWeatherByCity(city);
            }
        });

        // Enter key search
        document.getElementById('cityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const city = e.target.value.trim();
                if (city) {
                    this.searchWeatherByCity(city);
                }
            }
        });

        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getCurrentLocationWeather();
        });

        // Unit toggle
        document.getElementById('unitToggle').addEventListener('click', () => {
            this.toggleTemperatureUnit();
        });

        // Forecast toggle buttons
        document.getElementById('weeklyBtn').addEventListener('click', () => {
            this.showWeeklyForecast();
        });

        document.getElementById('monthlyBtn').addEventListener('click', () => {
            this.showMonthlyChart();
        });
    }

    async getCurrentLocationWeather() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    await this.fetchWeatherByCoordinates(lat, lon);
                },
                (error) => {
                    this.hideLoading();
                    this.showError('Unable to get your location. Please search for a city instead.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            this.showError('Geolocation is not supported by this browser.');
        }
    }

    async searchWeatherByCity(city) {
        try {
            this.showLoading();
            
            // First get coordinates from city name
            const geoResponse = await fetch(
                `${this.geoApiUrl}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`
            );
            
            if (!geoResponse.ok) {
                throw new Error('Failed to get location coordinates');
            }
            
            const geoData = await geoResponse.json();
            
            if (geoData.length === 0) {
                throw new Error('City not found. Please check the spelling and try again.');
            }
            
            const { lat, lon } = geoData[0];
            await this.fetchWeatherByCoordinates(lat, lon);
            
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    async fetchWeatherByCoordinates(lat, lon) {
        try {
            // Fetch current weather
            const currentResponse = await fetch(
                `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!currentResponse.ok) {
                throw new Error('Failed to fetch current weather data');
            }
            
            this.currentWeatherData = await currentResponse.json();

            // Fetch 5-day forecast
            const forecastResponse = await fetch(
                `${this.apiUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data');
            }
            
            this.forecastData = await forecastResponse.json();

            this.hideLoading();
            this.displayCurrentWeather();
            this.displayForecast();
            
        } catch (error) {
            this.hideLoading();
            this.showError(error.message);
        }
    }

    displayCurrentWeather() {
        if (!this.currentWeatherData) return;

        const data = this.currentWeatherData;
        const weather = data.weather[0];

        // Update city name
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        
        // Update temperature
        const temp = this.isCelsius ? data.main.temp : this.celsiusToFahrenheit(data.main.temp);
        const unit = this.isCelsius ? '°C' : '°F';
        document.getElementById('currentTemp').textContent = `${Math.round(temp)}${unit}`;
        
        // Update feels like
        const feelsLike = this.isCelsius ? data.main.feels_like : this.celsiusToFahrenheit(data.main.feels_like);
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(feelsLike)}${unit}`;
        
        // Update weather description
        document.getElementById('weatherDescription').textContent = this.capitalizeWords(weather.description);
        
        // Update weather icon
        const iconElement = document.getElementById('weatherIcon');
        iconElement.className = this.getWeatherIcon(weather.main, weather.icon);
        
        // Update additional details
        const highTemp = this.isCelsius ? data.main.temp_max : this.celsiusToFahrenheit(data.main.temp_max);
        const lowTemp = this.isCelsius ? data.main.temp_min : this.celsiusToFahrenheit(data.main.temp_min);
        
        document.getElementById('highTemp').textContent = `${Math.round(highTemp)}${unit}`;
        document.getElementById('lowTemp').textContent = `${Math.round(lowTemp)}${unit}`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

        // Show weather card
        document.getElementById('currentWeatherCard').style.display = 'block';
        
        // Update background based on weather
        this.updateBackgroundWeather(weather.main, weather.icon);
    }

    displayForecast() {
        if (!this.forecastData) return;

        // Group forecast data by days
        const dailyForecasts = this.groupForecastsByDay(this.forecastData.list);
        
        const forecastContainer = document.getElementById('weeklyForecast');
        forecastContainer.innerHTML = '';

        // Display 7-day forecast
        Object.keys(dailyForecasts).slice(0, 7).forEach(date => {
            const dayData = dailyForecasts[date][0]; // Use first forecast of the day
            const forecastCard = this.createForecastCard(date, dayData);
            forecastContainer.appendChild(forecastCard);
        });
    }

    groupForecastsByDay(forecasts) {
        const grouped = {};
        
        forecasts.forEach(forecast => {
            const date = forecast.dt_txt.split(' ')[0]; // Get date part (YYYY-MM-DD)
            
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(forecast);
        });
        
        return grouped;
    }

    createForecastCard(date, forecast) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-3';
        
        const temp = this.isCelsius ? forecast.main.temp : this.celsiusToFahrenheit(forecast.main.temp);
        const unit = this.isCelsius ? '°C' : '°F';
        
        const dayName = this.getDayName(date);
        const weatherIcon = this.getWeatherIcon(forecast.weather[0].main, forecast.weather[0].icon);
        
        col.innerHTML = `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    <i class="${weatherIcon}"></i>
                </div>
                <div class="forecast-temp">${Math.round(temp)}${unit}</div>
                <div class="forecast-desc">${this.capitalizeWords(forecast.weather[0].description)}</div>
                <div class="mt-2">
                    <small class="text-muted">
                        <i class="fas fa-tint me-1"></i>${forecast.main.humidity}%
                        <i class="fas fa-wind ms-2 me-1"></i>${Math.round(forecast.wind.speed * 3.6)} km/h
                    </small>
                </div>
            </div>
        `;
        
        return col;
    }

    showWeeklyForecast() {
        document.getElementById('weeklyBtn').classList.add('active');
        document.getElementById('monthlyBtn').classList.remove('active');
        document.getElementById('weeklyForecast').style.display = 'flex';
        document.getElementById('monthlyChart').style.display = 'none';
    }

    showMonthlyChart() {
        document.getElementById('weeklyBtn').classList.remove('active');
        document.getElementById('monthlyBtn').classList.add('active');
        document.getElementById('weeklyForecast').style.display = 'none';
        document.getElementById('monthlyChart').style.display = 'block';
        
        this.createTemperatureChart();
    }

    createTemperatureChart() {
        if (!this.forecastData) return;

        const ctx = document.getElementById('temperatureChart').getContext('2d');
        
        // Prepare data for chart
        const labels = [];
        const temperatures = [];
        const humidity = [];
        
        this.forecastData.list.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const label = date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                hour: '2-digit' 
            });
            
            labels.push(label);
            const temp = this.isCelsius ? forecast.main.temp : this.celsiusToFahrenheit(forecast.main.temp);
            temperatures.push(Math.round(temp));
            humidity.push(forecast.main.humidity);
        });

        // Destroy existing chart if it exists
        if (this.temperatureChart) {
            this.temperatureChart.destroy();
        }

        const unit = this.isCelsius ? '°C' : '°F';

        this.temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Temperature (${unit})`,
                    data: temperatures,
                    borderColor: 'rgb(103, 107, 208)',
                    backgroundColor: 'rgba(103, 107, 208, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Humidity (%)',
                    data: humidity,
                    borderColor: 'rgb(238, 137, 34)',
                    backgroundColor: 'rgba(238, 137, 34, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: `Temperature (${unit})`
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Humidity (%)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '5-Day Weather Forecast'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    toggleTemperatureUnit() {
        this.isCelsius = !this.isCelsius;
        const unitButton = document.getElementById('unitToggle');
        unitButton.textContent = this.isCelsius ? '°F' : '°C';
        
        // Update displayed temperatures
        if (this.currentWeatherData) {
            this.displayCurrentWeather();
            this.displayForecast();
            
            // Update chart if it's visible
            if (document.getElementById('monthlyChart').style.display !== 'none') {
                this.createTemperatureChart();
            }
        }
    }

    getWeatherIcon(main, icon) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-drizzle',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Smoke': 'fas fa-smog',
            'Haze': 'fas fa-smog',
            'Dust': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Sand': 'fas fa-smog',
            'Ash': 'fas fa-smog',
            'Squall': 'fas fa-wind',
            'Tornado': 'fas fa-tornado'
        };
        
        return iconMap[main] || 'fas fa-sun';
    }

    updateBackgroundWeather(main, icon) {
        const body = document.body;
        
        // Remove existing weather classes
        body.classList.remove('weather-clear', 'weather-clouds', 'weather-rain', 'weather-snow', 'weather-night');
        
        // Add appropriate class based on weather
        const isNight = icon && icon.includes('n');
        
        if (isNight) {
            body.classList.add('weather-night');
        } else {
            switch (main) {
                case 'Clear':
                    body.classList.add('weather-clear');
                    break;
                case 'Clouds':
                    body.classList.add('weather-clouds');
                    break;
                case 'Rain':
                case 'Drizzle':
                case 'Thunderstorm':
                    body.classList.add('weather-rain');
                    break;
                case 'Snow':
                    body.classList.add('weather-snow');
                    break;
                default:
                    body.classList.add('weather-clear');
            }
        }
    }

    getDayName(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        }
    }

    capitalizeWords(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    }

    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }

    showLoading() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }

    showError(message) {
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorAlert.style.display = 'block';
        errorAlert.classList.add('show');
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorAlert.classList.remove('show');
            setTimeout(() => {
                errorAlert.style.display = 'none';
            }, 150);
        }, 5000);
    }
}

// Additional weather background styles (add to CSS dynamically)
const weatherStyles = `
.weather-clear {
    background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
}

.weather-clouds {
    background: linear-gradient(135deg, #B0C4DE 0%, #D3D3D3 100%);
}

.weather-rain {
    background: linear-gradient(135deg, #4682B4 0%, #708090 100%);
}

.weather-snow {
    background: linear-gradient(135deg, #F0F8FF 0%, #E6E6FA 100%);
}

.weather-night {
    background: linear-gradient(135deg, #2F4F4F 0%, #191970 100%);
}
`;

// Add weather styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = weatherStyles;
document.head.appendChild(styleSheet);

// Initialize the weather app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
