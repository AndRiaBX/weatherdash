# WeatherDash — Weather Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21%2B-lightgrey)](https://expressjs.com)
[![GitHub issues](https://img.shields.io/github/issues/AndRiaBX/weatherdash)](https://github.com/AndRiaBX/weatherdash/issues)

A server-rendered weather dashboard built with **Node.js**, **Express**, and **EJS**. Uses the free [Open-Meteo API](https://open-meteo.com/) — **no API key required**.

## Features

- **Current Conditions** — Temperature, feels-like, humidity, wind speed & direction
- **7-Day Forecast** — Daily highs/lows with weather icons and descriptions
- **City Search** — Geocoding for any city worldwide
- **Server-Side Rendering** — No JavaScript required on the client
- **Responsive Design** — Beautiful gradient UI that works on mobile and desktop
- **Zero Dependencies on External Keys** — Open-Meteo is free and open

## Quick Start

### Local
```bash
npm install
npm start
```

Server runs on **http://localhost:3000**.

### Docker
```bash
docker build -t weatherdash .
docker run -p 3000:3000 weatherdash
```

Open **http://localhost:3000** in your browser.

## Usage

### Web UI

Open `http://localhost:3000` and enter a city name. Quick links:
- [Tbilisi](/weather?city=Tbilisi)
- [Tokyo](/weather?city=Tokyo)
- [London](/weather?city=London)

## Screenshots

> *(Screenshots coming soon — add your own by placing images in a `screenshots/` directory and linking them here.)*

| View | Preview |
|------|---------|
| Search form | `screenshots/search.png` |
| Weather display | `screenshots/weather.png` |
| Error page | `screenshots/error.png` |

## API

WeatherDash exposes a single server-rendered endpoint for weather lookups.

### `GET /`

Renders the search form. Accepts optional `POST` with `city` field for form-based search.

### `GET /weather?city={name}`

Fetches and renders current conditions and a 7-day forecast for the given city.

**Parameters:**

| Param  | Type   | Required | Description |
|--------|--------|----------|-------------|
| `city` | string | Yes      | City name (e.g., `Tbilisi`, `New+York`) |

**Examples:**

```
/weather?city=Tbilisi
/weather?city=New+York
/weather?city=Paris
```

**Responses:**

- **200** — Server-rendered HTML weather page
- **200 (with error)** — Error page if city not found or API failure

### Response Codes

| Code | Meaning |
|------|---------|
| 200  | Success — weather or error page rendered |
| 404  | City not found via geocoding |

## How It Works

WeatherDash uses two free Open-Meteo endpoints:

1. **Geocoding** — Converts city names to coordinates
   `https://geocoding-api.open-meteo.com/v1/search?name={city}`

2. **Weather Forecast** — Gets 7-day forecast for coordinates
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&...`

No rate limiting for moderate use. See [Open-Meteo docs](https://open-meteo.com/en/docs) for details.

## Project Structure

```
weatherdash/
├── src/
│   ├── server.js      # Express app — routes and search
│   └── weather.js     # Open-Meteo API client
├── views/
│   ├── index.ejs      # Search form with gradient background
│   ├── weather.ejs    # Weather display with current + 7-day
│   └── error.ejs      # Error page
├── package.json
└── README.md
```

## Weather Codes

WeatherDash maps WMO weather codes (00–99) to emoji icons and human-readable labels:

| Code | Icon | Description      |
|------|------|------------------|
| 0    | ☀️   | Clear sky        |
| 1–3  | 🌤️⛅☁️ | Cloudy variants  |
| 45   | 🌫️   | Foggy            |
| 51–57 | 🌧️  | Drizzle          |
| 61–67 | 🌦️🌧️ | Rain           |
| 71–77 | 🌨️  | Snow             |
| 80–86 | 🌦️🌧️🌨️ | Showers      |
| 95–99 | ⛈️  | Thunderstorm     |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with Node.js, Express, and Open-Meteo.*
