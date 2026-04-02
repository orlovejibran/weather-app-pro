const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function updateWeather(city) {
    // Show a loading message so you know it's working
    document.getElementById('cityName').innerText = "Loading...";

    try {
        const response = await fetch(`/weather?city=${city}`);
        const data = await response.json();

        if (data.error || data.cod === '404') {
            alert("City not found or API Error!");
            document.getElementById('cityName').innerText = "City Not Found";
            return;
        }

        // Update the UI
        document.getElementById('cityName').innerText = data.name;
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('desc').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
        
        // Fix the Icon to use HTTPS
        const icon = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        // Update the Background
        if (data.backgroundImage) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.backgroundImage}')`;
        }
    } catch (err) {
        console.error("Frontend Error:", err);
        alert("Something went wrong with the connection.");
    }
}

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        updateWeather(cityInput.value);
    }
});

// Auto-load a default city
window.onload = () => updateWeather('Douala');