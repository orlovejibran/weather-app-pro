const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.afd63ec82f206113b9c0870fc49e58ff;
    const unsplashKey = process.env.AK7b0n3Y5BFWMCl8txlrAeNQPkjxxzKc4wAZ3LJAXOY;

    // Check if city is provided
    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    try {
        // 1. Fetch Weather Data from OpenWeatherMap
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data;

        // 2. Fetch Random Background Image from Unsplash
        let imageUrl = "";
        try {
            const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city},landscape&client_id=${unsplashKey}`;
            const unsplashResponse = await axios.get(unsplashUrl);
            imageUrl = unsplashResponse.data.urls.regular;
        } catch (unsplashError) {
            console.log("Unsplash Image failed, using default color.");
            imageUrl = null; // App will fall back to CSS background
        }

        // 3. Send combined data back to your app.js
        res.json({
            ...weatherData,
            backgroundImage: imageUrl
        });

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "City not found or API error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});