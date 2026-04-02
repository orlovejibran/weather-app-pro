const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.WEATHER_API_KEY;
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    // DEBUGGING: This will show in your Railway Logs
    console.log("Searching for:", city);
    console.log("Weather Key exists?:", !!weatherKey); 

    if (!weatherKey) {
        return res.status(500).json({ error: "Server missing WEATHER_API_KEY" });
    }

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherResponse = await axios.get(weatherUrl);
        
        let imageUrl = "";
        try {
            const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city},landscape&client_id=${unsplashKey}`;
            const unsplashResponse = await axios.get(unsplashUrl);
            imageUrl = unsplashResponse.data.urls.regular;
        } catch (e) {
            imageUrl = null;
        }

        res.json({ ...weatherResponse.data, backgroundImage: imageUrl });

    } catch (error) {
        console.error("API Error Status:", error.response ? error.response.status : "No Response");
        res.status(500).json({ error: "City not found or API error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});