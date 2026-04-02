const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 

async function startWeatherApp(city) {
    if (rotationTimer) clearInterval(rotationTimer);

    const updateAll = async () => {
        try {
            const response = await fetch(`/weather?city=${city}`);
            const data = await response.json();

            if (data.error) {
                alert("City not found!");
                clearInterval(rotationTimer);
                return;
            }

            // UI Updates
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('desc').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
            
            const icon = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // Update Background with your API image
            if (data.backgroundImage) {
                document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.backgroundImage}')`;
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Run immediately
    await updateAll();

    // Rotate every 10 seconds (Remember: this uses 1 credit per 10 seconds)
    rotationTimer = setInterval(updateAll, 10000);
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) startWeatherApp(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});