# WeatherDash — Weather Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21%2B-lightgrey)](https://expressjs.com)
[![Tests](https://github.com/AndRiaBX/weatherdash/actions/workflows/ci.yml/badge.svg)](https://github.com/AndRiaBX/weatherdash/actions/workflows/ci.yml)
[![GitHub issues](https://img.shields.io/github/issues/AndRiaBX/weatherdash)](https://github.com/AndRiaBX/weatherdash/issues)

A server-rendered weather dashboard built with **Node.js**, **Express**, and **EJS**. Uses the free [Open-Meteo API](https://open-meteo.com/) — **no API key required**.

## Features

- **Current Conditions** — Temperature, feels-like, humidity, wind speed & direction
- **7-Day Forecast** — Daily highs/lows with weather icons and descriptions
- **City Search** — Geocoding for any city worldwide
- **Server-Side Rendering** — No JavaScript required on the client
- **Responsive Design** — Gradient UI that works on mobile and desktop
- **Zero Dependencies on External Keys** — Open-Meteo is free and open

## Screenshots

| View | Description |
|------|-------------|
| Search form | Enter a city name to get weather — `screenshots/search.png` |
| Weather display | Current conditions + 7-day forecast — `screenshots/weather.png` |
| Error page | Friendly error when city not found — `screenshots/error.png` |

> *(Place screenshots in `screenshots/` and update the links above.)*

## Quick Start

### Local
```bash
npm install
npm start        # production
npm run dev      # watch mode (auto-reload)
```

Server runs on **http://localhost:3000**.

### Docker
```bash
docker build -t weatherdash .
docker run -p 3000:3000 weatherdash
```

A `.dockerignore` is included to keep images lean by excluding `node_modules/`, tests, and dev files.

## Usage

### Web UI

Open `http://localhost:3000` and enter a city name. Quick links:

- [Tbilisi](/weather?city=Tbilisi)
- [Tokyo](/weather?city=Tokyo)
- [London](/weather?city=London)

### Weather Codes

WeatherDash maps [WMO weather codes](https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM) (00–99) to emoji icons and human-readable labels:

| Code Range | Icon | Description |
|------------|------|-------------|
| 0          | ☀️   | Clear sky |
| 1–3        | 🌤️⛅☁️ | Mainly clear → Overcast |
| 45–48      | 🌫️   | Fog / Rime fog |
| 51–57      | 🌧️   | Drizzle (light to freezing) |
| 61–67      | 🌦️🌧️ | Rain (slight to freezing heavy) |
| 71–77      | 🌨️   | Snow (slight to grains) |
| 80–86      | 🌦️🌧️🌨️ | Showers (rain & snow) |
| 95–99      | ⛈️   | Thunderstorm with/without hail |

Unknown codes fall back to ❓ with label "Unknown".

## API

WeatherDash exposes a single server-rendered endpoint for weather lookups. All responses are HTML (server-rendered via EJS templates).

### `GET /`

Renders the search form.

**POST** to `/` with `city` field for form-based search.

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

| Status | Content | Description |
|--------|---------|-------------|
| 200    | HTML    | Weather page with current conditions and 7-day forecast |
| 200    | HTML    | Error page if city not found or API failure |
| 302    | Redirect | Redirect to `/` if `city` parameter is missing |

### Weather Data Response (rendered as HTML)

The server-rendered weather page includes:

- **Current Conditions:** Temperature (°C), feels-like, humidity (%), wind speed & direction
- **7-Day Forecast:** Daily highs/lows with weather icons
- **Location Info:** City name, region, country

## How It Works

WeatherDash uses two free Open-Meteo endpoints:

1. **Geocoding** — Converts city names to coordinates
   `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`

2. **Weather Forecast** — Gets 7-day forecast for coordinates
   `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone={tz}&forecast_days=7`

No rate limiting for moderate use. See [Open-Meteo docs](https://open-meteo.com/en/docs) for details.

## Project Structure

```
weatherdash/
├── src/
│   ├── server.js        # Express app — routes, validation, rendering
│   └── weather.js       # Open-Meteo API client + WMO code mapping
├── views/
│   ├── index.ejs        # Search form
│   ├── weather.ejs      # Weather display (current + 7-day)
│   └── error.ejs        # Error page
├── test/
│   └── test_weather.js  # Test suite (node:test)
├── screenshots/         # README screenshots
├── .github/
│   └── workflows/
│       └── ci.yml       # CI pipeline
├── .dockerignore        # Docker build exclusions
├── CONTRIBUTING.md      # Contribution guidelines
├── Dockerfile
├── LICENSE              # MIT
├── package.json
└── README.md
```

## Development

### Prerequisites

- **Node.js 18+** (uses built-in `node:test` and `node --watch`)
- npm (bundled with Node.js)

### Running Tests

```bash
npm test            # Run all tests
npm run test:watch  # Watch mode
```

Tests use Node.js built-in `node:test` — no test framework dependency. The suite covers:

- Weather code mapping (known & unknown codes)
- Wind direction cardinal resolution
- HTTP route handling (GET/POST, valid/invalid input)
- City name validation (empty, too long, not found)

### Code Quality

- **`src/weather.js`** — Handles HTTP status codes, timeouts, JSON parse errors, null results from geocoding, and missing daily data gracefully
- **`src/server.js`** — Validates input length (max 100 chars), handles empty queries, catches all async errors, skips auto-listen during tests via `NODE_ENV=test`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

TL;DR: Fork → branch → commit → test → PR.

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with Node.js, Express, and Open-Meteo.*
