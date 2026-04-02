const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 

async function startWeatherApp(city) {
    // Stop any old timers if the user searches a new city
    if (rotationTimer) clearInterval(rotationTimer);

    const updateUI = async () => {
        try {
            const response = await fetch(`/weather?city=${city}`);
            const data = await response.json();

            if (data.error || data.cod === '404') {
                alert("City not found!");
                clearInterval(rotationTimer);
                return;
            }

            // Update Text Data
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('desc').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
            
            // Update Icon
            const icon = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // Update Background
            if (data.backgroundImage) {
                document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.backgroundImage}')`;
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    // Run immediately
    await updateUI();

    // Start 10-second rotation for the background
    rotationTimer = setInterval(updateUI, 10000);
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        startWeatherApp(city);
    } else {
        alert("Please enter a city name");
    }
});