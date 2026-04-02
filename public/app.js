const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 

async function startWeatherApp(city) {
    // Clear any previous timers
    if (rotationTimer) clearInterval(rotationTimer);

    // 1. Function to update weather data
    const updateWeatherOnly = async () => {
        try {
            const response = await fetch(`/weather?city=${city}`);
            const data = await response.json();

            if (data.error || data.cod === '404') {
                alert("City not found!");
                clearInterval(rotationTimer);
                return;
            }

            // Update the UI text
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('desc').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
            
            // Update the icon
            const icon = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        } catch (err) {
            console.error("Weather fetch error:", err);
        }
    };

    // 2. Function to rotate the background image (Unlimited Source)
    const rotateBackground = () => {
        const randomSig = Math.floor(Math.random() * 10000);
        // This URL searches for your specific city!
        const imageUrl = `https://source.unsplash.com/featured/1600x900?${city},city,landscape&sig=${randomSig}`;
        
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${imageUrl}')`;
        };
    };

    // Initialize
    await updateWeatherOnly();
    rotateBackground();

    // Set the 10-second loop
    rotationTimer = setInterval(rotateBackground, 10000);
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        startWeatherApp(city);
    } else {
        alert("Please enter a city name");
    }
});