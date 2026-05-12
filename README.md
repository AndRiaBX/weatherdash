# WeatherDash — Weather Dashboard

A server-rendered weather dashboard built with **Node.js**, **Express**, and **EJS**. Uses the free [Open-Meteo API](https://open-meteo.com/) — no API key required.

## Features

- Current conditions: temperature, feels-like, humidity, wind speed & direction
- 7-day forecast with daily highs/lows and weather icons
- Search any city (uses Open-Meteo geocoding)
- Server-side rendering — no JavaScript required on the client
- Responsive design

## Setup

```bash
npm install
npm start
```

Server runs on `http://localhost:3000`.

## Usage

Open `http://localhost:3000` and enter a city name. Default cities:
- `/weather?city=Tbilisi`
- `/weather?city=Tokyo`
- `/weather?city=London`

## API

Open-Meteo endpoints used:
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name={city}`
- **Weather**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`

## Structure

```
weatherdash/
├── src/
│   ├── server.js      # Express app
│   └── weather.js     # Open-Meteo API client
├── views/
│   ├── index.ejs      # Search form
│   ├── weather.ejs    # Weather display
│   └── error.ejs      # Error page
├── package.json
└── README.md
```
