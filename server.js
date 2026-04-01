import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Get Weather Data
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ message: "City not found" });
    }
});

// Get Random Image - Added "sig" parameter to prevent browser caching the same image
app.get('/api/image', async (req, res) => {
    const city = req.query.city;
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    const randomSig = Math.random(); // Forces a fresh image fetch
    const url = `https://api.unsplash.com/photos/random?query=${city},landscape&client_id=${accessKey}&sig=${randomSig}`;

    try {
        const response = await axios.get(url);
        res.json({ imageUrl: response.data.urls.regular });
    } catch (error) {
        res.json({ imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 App running at http://localhost:${PORT}`));