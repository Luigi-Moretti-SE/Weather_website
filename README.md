# WeatherCast Website

A comprehensive weather website built to complement the WeatherCast Flutter mobile application. This responsive web application provides current weather conditions, forecasts, and location-based weather services.

## 🚀 Features

### Core Weather Functionality
- **Current Weather Display**: Real-time weather conditions with location detection
- **City Search**: Search weather by city name with autocomplete suggestions
- **7-Day Forecast**: Detailed weekly weather predictions
- **Monthly Charts**: Visual temperature and humidity trends using Chart.js
- **Unit Conversion**: Toggle between Fahrenheit and Celsius
- **Dynamic Backgrounds**: Weather-based animated backgrounds

### Pages
1. **Landing/Home Page** (`index.html`)
   - Hero section with search functionality
   - Current weather display card
   - Interactive forecast charts
   - Features overview

2. **About Us Page** (`about.html`)
   - Team member profiles (RK, EE, SB, MA, UE)
   - Company mission and values
   - Technology stack showcase

3. **Contact Page** (`contact.html`)
   - Contact form with validation
   - Business information and hours
   - FAQ section with accordion
   - Social media links

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript ES6
- **Backend**: PHP for form processing
- **APIs**: OpenWeatherMap API, Geolocation API
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Design**: Responsive, mobile-first approach

## 🔧 Setup & Installation

### Prerequisites
- Web server with PHP support (for contact form)
- Modern web browser
- Internet connection for API calls

### Local Development
1. Clone or download the project files
2. Navigate to the project directory
3. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using PHP
   php -S localhost:8000
   
   # Using Node.js (with http-server)
   npx http-server -p 8000
   ```
4. Open `http://localhost:8000` in your browser

### API Configuration
The website is configured for GitHub Pages deployment:

#### For GitHub Pages (Live Deployment):
- The `js/config.js` file is included in the repository without sensitive API keys
- Users can provide their API key via URL parameter: `https://yourusername.github.io/weather-website/?api_key=YOUR_API_KEY`
- Or the app will prompt users to enter their API key, which gets stored in browser localStorage

#### For Local Development:
1. Copy `js/config.local.js` to create your own config file
2. Add your OpenWeatherMap API key to the copied file
3. The app will use your local API key for development

**API Key Sources**: OpenWeatherMap API (free tier)
- Rate limit: 1000 calls/day
- Supports current weather, forecasts, and geocoding

## 📁 Project Structure

```
weather_website/
├── index.html              # Main landing page
├── about.html              # About us page
├── contact.html            # Contact page
├── contact_handler.php     # PHP form processor
├── favicon.svg             # Website icon
├── test.html              # API testing page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── weather.js         # Weather functionality
│   └── contact.js         # Contact form handling
├── images/
│   └── README.md          # Image usage guide
└── assets/                # Additional assets
```

## 🎨 Design System

### Color Palette
- **Primary**: #676BD0 (Purple)
- **Secondary**: #5E4BBE (Darker Purple)
- **Accent**: #EE8922 (Orange)
- **Text**: #333 (Dark Gray)
- **Background**: #f8f9fa (Light Gray)

### Typography
- **Headings**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Body**: System font stack for optimal readability

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 992px
- **Desktop**: > 992px

## 🔌 API Integration

### OpenWeatherMap Endpoints Used
1. **Current Weather**: `/weather?q={city}&appid={key}`
2. **5-Day Forecast**: `/forecast?q={city}&appid={key}`
3. **Geocoding**: `/geo/1.0/direct?q={city}&appid={key}`
4. **Reverse Geocoding**: `/geo/1.0/reverse?lat={lat}&lon={lon}&appid={key}`

### Error Handling
- Network connectivity issues
- Invalid API responses
- Geolocation permission denied
- City not found scenarios

## 📧 Contact Form Features

### Form Fields
- Name (required)
- Email (required, validated)
- Subject (dropdown selection)
- Message (required, character limit)

### PHP Backend (`contact_handler.php`)
- Input validation and sanitization
- CSV file storage (`contact_submissions.csv`)
- Email notifications (admin and auto-reply)
- JSON API responses
- Rate limiting protection

## 📱 Mobile Compatibility

- Fully responsive design
- Touch-friendly interface
- Optimized loading times
- Progressive Web App ready
- Cross-browser compatibility

## 🧪 Testing

Run the included test page (`test.html`) to verify:
- API connectivity
- Geolocation availability
- Chart.js functionality
- Error handling

## 🚀 Deployment

### Web Hosting Requirements
- PHP 7.4+ support
- SSL certificate (recommended)
- File write permissions for contact form
- Domain with HTTPS for geolocation

### Recommended Hosting Platforms
- Netlify (with serverless functions)
- Vercel
- GitHub Pages (static hosting)
- Traditional web hosting (cPanel)

## 🔒 Security Considerations

- Input sanitization in PHP
- CSRF protection for forms
- Rate limiting for API calls
- Environment variables for sensitive data
- Regular security updates

## 🤝 Team Members

- **RK** - Project Lead (rk@weathercast.com)
- **EE** - Frontend Developer (ee@weathercast.com)
- **SB** - Backend Developer (sb@weathercast.com)
- **MA** - UI/UX Designer (ma@weathercast.com)
- **UE** - Quality Assurance (ue@weathercast.com)

## 📄 License

This project is part of the WeatherCast application suite. All rights reserved.

## 🔄 Version History

- **v1.0.0** - Initial release with core weather functionality
- **v1.1.0** - Added contact form and PHP backend
- **v1.2.0** - Enhanced responsive design and charts
- **v1.3.0** - Added favicon and improved testing

## 📞 Support

For technical support or questions:
- Email: support@weathercast.com
- Visit: [Contact Page](contact.html)
- GitHub Issues: [Project Repository]

---

Built with ❤️ by the WeatherCast Team
