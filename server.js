const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve files from the public folder
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.WEATHER_API_KEY;

    if (!city) return res.status(400).json({ error: "City required" });

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherRes = await axios.get(weatherUrl);
        
        // We only send weather data. The frontend handles the "Unlimited" images.
        res.json(weatherRes.data);
    } catch (error) {
        console.error("Weather API Error:", error.message);
        res.status(500).json({ error: "City not found or API error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});