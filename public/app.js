const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weather-info');

let clockInterval;
let backgroundInterval;

function startLiveClock(timezoneOffset) {
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(() => {
        const localTime = new Date(new Date().getTime() + (timezoneOffset * 1000) + (new Date().getTimezoneOffset() * 60000));
        document.getElementById('dateText').innerText = localTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('timeText').innerText = localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    }, 1000);
}

async function changeBackground(city) {
    console.log(`🔄 Attempting to rotate background for: ${city}`);
    try {
        // Adding a unique timestamp to BOTH the internal API call and the Unsplash request
        const imageRes = await fetch(`/api/image?city=${encodeURIComponent(city)}&nocache=${Date.now()}`);
        const imageData = await imageRes.json();
        
        if (imageData.imageUrl) {
            const newImg = new Image();
            newImg.src = imageData.imageUrl;
            newImg.onload = () => {
                document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('${imageData.imageUrl}')`;
                console.log("✅ Background updated successfully!");
            };
        }
    } catch (err) {
        console.error("❌ background rotation failed:", err);
    }
}

async function updateWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    try {
        const weatherRes = await fetch(`/api/weather?city=${city}`);
        const data = await weatherRes.json();

        if (weatherRes.status !== 200) return alert("City not found!");

        // Start Clock
        startLiveClock(data.timezone);

        // Reset and Start Background Rotation (Every 10 seconds)
        if (backgroundInterval) clearInterval(backgroundInterval);
        
        // Call immediately once
        changeBackground(city); 
        
        // Then set the timer
        backgroundInterval = setInterval(() => {
            changeBackground(city);
        }, 10000);

        // Update Text UI
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('description').innerText = data.weather[0].description.toUpperCase();
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind.speed} km/h`;

        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        weatherInfo.classList.remove('hidden');
    } catch (err) {
        console.error("Critical Error:", err);
    }
}

searchBtn.addEventListener('click', updateWeather);
cityInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') updateWeather(); });