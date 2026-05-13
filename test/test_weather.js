/**
 * WeatherDash test suite — tests weather API calls, error handling, input validation.
 * Uses Node.js built-in `node:test` with manual module mocking.
 */
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');

// Prevent server.js auto-listen during tests
process.env.NODE_ENV = 'test';

// ── Mock weather module BEFORE server.js imports it ────────────────
// Require and cache weather, then replace only the HTTP-dependent functions.
// Server.js destructures searchCity/getForecast at require time, so it
// picks up the mocked versions from the cached exports.
const weatherModule = require('../src/weather');
const realGetWeatherInfo = weatherModule.getWeatherInfo;
const realGetWindDirection = weatherModule.getWindDirection;

weatherModule.searchCity = async (query) => {
  const q = query.toLowerCase();
  if (q === 'london') {
    return { name: 'London', country: 'United Kingdom', admin1: 'England',
             latitude: 51.5, longitude: -0.12, timezone: 'Europe/London' };
  }
  if (q === 'tbilisi') {
    return { name: 'Tbilisi', country: 'Georgia', admin1: 'Tbilisi',
             latitude: 41.69, longitude: 44.83, timezone: 'Asia/Tbilisi' };
  }
  return null;
};

weatherModule.getForecast = async (_lat, _lon, _tz) => ({
  current: { temp: 15, feelsLike: 13, humidity: 72, windSpeed: 12, windDirection: 'SW',
             weather: { icon: '☁️', label: 'Partly cloudy' } },
  days: [
    { date: '2026-05-12', dayName: 'Today', max: 18, min: 10,
      weather: { icon: '☁️', label: 'Partly cloudy' } },
    { date: '2026-05-13', dayName: 'Wed', max: 20, min: 12,
      weather: { icon: '🌧️', label: 'Light rain' } },
  ],
});

// Now import server — its destructured searchCity/getForecast are the mocks
const { app } = require('../src/server');

// ── Helpers ─────────────────────────────────────────────────────────
let server;
let baseUrl;

function makeRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(baseUrl);
    const opts = {
      hostname: '127.0.0.1', port: url.port, path: urlPath, method,
      headers: body ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {},
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function urlencode(obj) {
  return Object.entries(obj).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

// ── Tests ───────────────────────────────────────────────────────────
describe('WeatherDash', () => {
  before(async () => {
    await new Promise(resolve => {
      server = app.listen(0, '127.0.0.1', () => {
        baseUrl = `http://127.0.0.1:${server.address().port}`;
        resolve();
      });
    });
  });

  after(() => { if (server) server.close(); });

  describe('Pure: getWeatherInfo', () => {
    it('should return correct label for known code', () => {
      const r = realGetWeatherInfo(0);
      assert.equal(r.label, 'Clear sky');
    });

    it('should return Unknown for invalid code', () => {
      const r = realGetWeatherInfo(999);
      assert.equal(r.label, 'Unknown');
    });
  });

  describe('Pure: getWindDirection', () => {
    it('should resolve cardinal directions', () => {
      assert.equal(realGetWindDirection(0), 'N');
      assert.equal(realGetWindDirection(90), 'E');
      assert.equal(realGetWindDirection(180), 'S');
      assert.equal(realGetWindDirection(270), 'W');
    });

    it('should handle null/undefined', () => {
      assert.equal(realGetWindDirection(null), '\u2014');
    });
  });

  describe('Web UI: GET /', () => {
    it('should serve search form', async () => {
      const res = await makeRequest('GET', '/');
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('<!DOCTYPE html>'));
    });
  });

  describe('Web UI: POST /', () => {
    it('should show weather for valid city', async () => {
      const res = await makeRequest('POST', '/', urlencode({ city: 'London' }));
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('Partly cloudy'));
    });

    it('should show error for empty city', async () => {
      const res = await makeRequest('POST', '/', urlencode({ city: '' }));
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('Please enter'));
    });

    it('should show error for unknown city', async () => {
      const res = await makeRequest('POST', '/', urlencode({ city: 'Atlantis' }));
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('not found'));
    });

    it('should reject overly long city name', async () => {
      const res = await makeRequest('POST', '/', urlencode({ city: 'X'.repeat(101) }));
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('too long'));
    });
  });

  describe('Web UI: GET /weather', () => {
    it('should show weather via GET query', async () => {
      const res = await makeRequest('GET', '/weather?city=Tbilisi');
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('Tbilisi'));
    });

    it('should redirect to / when city is missing', async () => {
      const res = await makeRequest('GET', '/weather');
      assert.equal(res.status, 302);
      assert.equal(res.headers.location, '/');
    });

    it('should show error for unknown city via GET', async () => {
      const res = await makeRequest('GET', '/weather?city=Nowhereland');
      assert.equal(res.status, 200);
      assert.ok(res.body.includes('not found'));
    });
  });
});
