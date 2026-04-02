const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 
let currentCity = ""; // Track the city globally

async function startWeatherApp(city) {
    // 1. Clear old timer immediately so images don't mix
    if (rotationTimer) clearInterval(rotationTimer);
    
    currentCity = city; 

    const fetchData = async () => {
        try {
            // We use the global currentCity so the timer stays synced
            const response = await fetch(`/weather?city=${currentCity}`);
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

            if (data.backgroundImage) {
                document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${data.backgroundImage}')`;
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Run once immediately
    await fetchData();

    // Start 10-second rotation for the NEW city
    rotationTimer = setInterval(fetchData, 10000);
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        startWeatherApp(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});