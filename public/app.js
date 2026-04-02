const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

async function getWeather(city) {
    try {
        const response = await fetch(`/weather?city=${city}`);
        const data = await response.json();

        if (data.cod === '404') {
            alert("City not found! Please try again.");
            return;
        }

        // Update Text
        document.getElementById('cityName').innerText = data.name;
        document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
        document.getElementById('desc').innerText = data.weather[0].description;
        document.getElementById('humidity').innerText = `${data.main.humidity}%`;
        document.getElementById('wind').innerText = `${data.wind.speed} km/h`;

        // Update Weather Icon with HTTPS
        const iconCode = data.weather[0].icon;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Update Background Image from Unsplash
        if (data.backgroundImage) {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${data.backgroundImage}')`;
        }

    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

searchBtn.addEventListener('click', () => {
    if (cityInput.value) getWeather(cityInput.value);
});

// Load a default city on start
window.onload = () => getWeather('Bamenda');