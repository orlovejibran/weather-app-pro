const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function updateWeather(city) {
    try {
        const response = await fetch(`/weather?city=${city}`);
        const data = await response.json();

        if (data.cod === '404') {
            alert("City not found!");
            return;
        }

        document.getElementById('cityName').innerText = data.name;
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('desc').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
        
        const icon = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

        if (data.backgroundImage) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.backgroundImage}')`;
        }
    } catch (err) {
        console.log("Error:", err);
    }
}

searchBtn.addEventListener('click', () => {
    if (cityInput.value) updateWeather(cityInput.value);
});

// Auto-load your home city
window.onload = () => updateWeather('Bamenda');