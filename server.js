const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.afd63ec82f206113b9c0870fc49e58ff;
    const unsplashKey = process.env.AK7b0n3Y5BFWMCl8txlrAeNQPkjxxzKc4wAZ3LJAXOY;

    try {
        // 1. Get Weather Data
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        // 2. Get Background Image from Unsplash
        const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city},landscape&client_id=${unsplashKey}`;
        const unsplashResponse = await axios.get(unsplashUrl);
        const imageUrl = unsplashResponse.data.urls.regular;

        // 3. Send EVERYTHING back to the frontend
        res.json({
            ...weatherData,
            backgroundImage: imageUrl
        });

    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Could not fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});