const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 
let clockInterval;

function updateCityTime(timezoneOffset) {
    if (clockInterval) clearInterval(clockInterval);

    const tick = () => {
        // Calculate the time in the specific city using the offset (seconds)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const cityTime = new Date(utc + (1000 * timezoneOffset));

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        document.getElementById('date').innerText = cityTime.toLocaleDateString('en-GB', options);
        document.getElementById('time').innerText = cityTime.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    tick();
    clockInterval = setInterval(tick, 1000);
}

async function startWeatherApp(city) {
    if (rotationTimer) clearInterval(rotationTimer);

    const fetchData = async () => {
        try {
            const response = await fetch(`/weather?city=${city}`);
            const data = await response.json();

            if (data.error) {
                alert("City not found!");
                return;
            }

            // 1. Update Time & Date using the city's timezone offset
            updateCityTime(data.timezone);

            // 2. Update Weather UI
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('desc').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
            
            const icon = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

            // 3. Update Background (Desktop and Phone fix)
            if (data.backgroundImage) {
                const imgUrl = data.backgroundImage;
                document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${imgUrl}')`;
            }
        } catch (err) {
            console.error(err);
        }
    };

    await fetchData();
    rotationTimer = setInterval(fetchData, 10000);
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) startWeatherApp(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});