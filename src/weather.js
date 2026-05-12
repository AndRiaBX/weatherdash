/**
 * Open-Meteo API client for weatherdash.
 * Endpoints: geocoding search + weather forecast.
 */

const https = require('https');

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';
const HTTP_TIMEOUT = 10000; // 10 seconds

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse weather data.'));
        }
      });
    });

    req.on('error', () => reject(new Error('Failed to fetch weather data.')));
    req.setTimeout(HTTP_TIMEOUT, () => {
      req.destroy();
      reject(new Error('Weather API request timed out.'));
    });
  });
}

// Maps WMO weather codes to icon + label
const WMO_CODES = {
  0:  { icon: '☀️', label: 'Clear sky' },
  1:  { icon: '🌤️', label: 'Mainly clear' },
  2:  { icon: '⛅', label: 'Partly cloudy' },
  3:  { icon: '☁️', label: 'Overcast' },
  45: { icon: '🌫️', label: 'Foggy' },
  48: { icon: '🌫️', label: 'Depositing rime fog' },
  51: { icon: '🌧️', label: 'Light drizzle' },
  53: { icon: '🌧️', label: 'Moderate drizzle' },
  55: { icon: '🌧️', label: 'Dense drizzle' },
  56: { icon: '🌧️', label: 'Freezing light drizzle' },
  57: { icon: '🌧️', label: 'Freezing dense drizzle' },
  61: { icon: '🌦️', label: 'Slight rain' },
  63: { icon: '🌧️', label: 'Moderate rain' },
  65: { icon: '🌧️', label: 'Heavy rain' },
  66: { icon: '🌧️', label: 'Freezing light rain' },
  67: { icon: '🌧️', label: 'Freezing heavy rain' },
  71: { icon: '🌨️', label: 'Slight snow' },
  73: { icon: '🌨️', label: 'Moderate snow' },
  75: { icon: '🌨️', label: 'Heavy snow' },
  77: { icon: '🌨️', label: 'Snow grains' },
  80: { icon: '🌦️', label: 'Slight rain showers' },
  81: { icon: '🌧️', label: 'Moderate rain showers' },
  82: { icon: '🌧️', label: 'Violent rain showers' },
  85: { icon: '🌨️', label: 'Slight snow showers' },
  86: { icon: '🌨️', label: 'Heavy snow showers' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm with slight hail' },
  99: { icon: '⛈️', label: 'Thunderstorm with heavy hail' },
};

function getWeatherInfo(code) {
  return WMO_CODES[code] || { icon: '❓', label: 'Unknown' };
}

function getWindDirection(deg) {
  if (deg == null) return '—';
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return dirs[index];
}

async function searchCity(query) {
  const url = `${GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const data = await fetchJSON(url);

  if (!data.results || data.results.length === 0) {
    return null;
  }

  const r = data.results[0];
  return {
    name: r.name,
    country: r.country || '',
    admin1: r.admin1 || '',
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone || 'auto',
  };
}

async function getForecast(latitude, longitude, timezone) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone,
    forecast_days: 7,
  });
  const url = `${WEATHER_URL}?${params.toString()}`;
  const data = await fetchJSON(url);

  if (!data || data.error) {
    throw new Error(data?.reason || 'Weather API error');
  }

  const current = data.current;
  const daily = data.daily;

  const todayWeather = getWeatherInfo(current.weather_code);

  const forecast = {
    location: { latitude, longitude },
    current: {
      temp: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: getWindDirection(current.wind_direction_10m),
      weather: todayWeather,
    },
    days: [],
  };

  if (daily) {
    for (let i = 0; i < daily.time.length; i++) {
      const wCode = daily.weather_code[i];
      const date = new Date(daily.time[i] + 'T12:00:00');
      const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
      forecast.days.push({
        date: daily.time[i],
        dayName,
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
        weather: getWeatherInfo(wCode),
      });
    }
  }

  return forecast;
}

module.exports = { searchCity, getForecast, getWeatherInfo, getWindDirection, WMO_CODES };
