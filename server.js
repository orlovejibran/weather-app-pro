const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    const weatherKey = process.env.WEATHER_API_KEY;

    if (!city) return res.status(400).json({ error: "City required" });

    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${weatherKey}`;
        const weatherRes = await axios.get(weatherUrl);
        res.json(weatherRes.data);
    } catch (error) {
        res.status(404).json({ error: "City not found" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));