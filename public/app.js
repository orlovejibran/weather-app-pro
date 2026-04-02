const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
let rotationTimer; 

async function startWeatherApp(city) {
    if (rotationTimer) clearInterval(rotationTimer);

    document.getElementById('cityName').innerText = "Loading...";

    const updateWeatherOnly = async () => {
        try {
            const response = await fetch(`/weather?city=${city}`);
            const data = await response.json();

            if (data.error) {
                alert("City not found! Check your spelling (e.g., Yaounde).");
                document.getElementById('cityName').innerText = "SkyCast Pro";
                return false;
            }

            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temp').innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById('desc').innerText = data.weather[0].description;
            document.getElementById('humidity').innerText = `${data.main.humidity}%`;
            document.getElementById('wind').innerText = `${data.wind.speed} km/h`;
            
            const icon = data.weather[0].icon;
            document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const rotateBackground = () => {
        // We are using a new "Unlimited" source since Unsplash Source is down.
        // This generates a random high-quality image of the city you searched.
        const randomSig = Math.floor(Math.random() * 1000);
        const imageUrl = `https://loremflickr.com/1600/900/${city},landscape/all?sig=${randomSig}`;
        
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`;
        };
    };

    const success = await updateWeatherOnly();
    if (success) {
        rotateBackground();
        // Change image every 10 seconds
        rotationTimer = setInterval(rotateBackground, 10000);
    }
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) startWeatherApp(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});