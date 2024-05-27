require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const port = process.env.PORT || 3000;
const sensorApiUrl = process.env.SENSOR_API_URL;

// Middleware to parse incoming JSON data
app.use(express.json());

// Define the /api/sensor-data endpoint for GET requests
app.get('/api/sensor-data', async (req, res) => {
    const { roomNumber, temperature, humidity, soundLevel, airQuality, comfort } = req.query;

    if (
        roomNumber === undefined ||
        temperature === undefined ||
        humidity === undefined ||
        soundLevel === undefined ||
        airQuality === undefined ||
        comfort === undefined
    ) {
        return res.status(400).send('Missing data fields');
    }

    console.log(`Received data - Room Number: ${roomNumber}, Temperature: ${temperature}, Humidity: ${humidity}, Sound Level: ${soundLevel}, Air Quality: ${airQuality}, Comfort: ${comfort}`);

    try {
        // Make a POST request to update sensor data
        const response = await axios.post(sensorApiUrl, {
            roomNumber,
            temperature,
            humidity,
            airQuality,
            motion: soundLevel > 50 ? 'Detected' : 'Not Detected'  // Assuming soundLevel > 50 as motion detected
        });

        console.log('Sensor data updated:', response.data);
        res.status(200).send(`Data received and updated successfully for Room Number ${roomNumber}`);
    } catch (error) {
        console.error('Error updating sensor data:', error);
        res.status(500).send('Server error while updating sensor data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
