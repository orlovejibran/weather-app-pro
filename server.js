const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.WEATHER_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!city) return res.status(400).json({ error: "City required" });

    try {
        // 1. Get Weather Data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherRes = await axios.get(weatherUrl);

        // 2. Get High-Quality Image from your Unsplash API
        let imageUrl = "";
        try {
            const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city},landscape&client_id=${unsplashKey}`;
            const unsplashRes = await axios.get(unsplashUrl);
            imageUrl = unsplashRes.data.urls.regular;
        } catch (e) {
            console.log("Unsplash limit reached or error, using fallback.");
            imageUrl = null;
        }

        res.json({
            ...weatherRes.data,
            backgroundImage: imageUrl
        });
    } catch (error) {
        res.status(404).json({ error: "City not found" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));