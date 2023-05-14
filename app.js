// app.js

const express = require("express");
const https = require("https");
const fetch = require('node-fetch');
const cors = require("cors");
const port = process.env.PORT || 3000;



const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public')); // Serve static files like CSS

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", async (req, res) => {
  const query = req.body.cityName;

    const apiKey = "031b96f08334d3b79ce94659d8f14975";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ apiKey +"&units=" + unit;
  console.log(query);
  console.log(url);
  


  try {
    const apiResponse = await fetch(url);
    if (!apiResponse.ok) { // If response is not ok (status code outside 200-299)
      throw new Error(`HTTP error! status: ${apiResponse.status}`);
    } else {
      const weatherData = await apiResponse.json();
      const responseData = {
        temp: weatherData.main.temp,
        feelsLike: weatherData.main.feels_like,
        tempMin: weatherData.main.temp_min,
        tempMax: weatherData.main.temp_max,
        pressure: weatherData.main.pressure,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        cloudiness: weatherData.clouds.all,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        city: weatherData.name,
        country: weatherData.sys.country,
      };
      res.json(responseData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
