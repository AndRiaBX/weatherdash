const express = require('express');
const path = require('path');
const { searchCity, getForecast } = require('./weather');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Home — search form
app.get('/', (req, res) => {
  res.render('index', { error: null, city: null });
});

const MAX_CITY_LENGTH = 100;

// Weather search (form POST)
app.post('/', async (req, res) => {
  const query = (req.body.city || '').trim();
  if (!query) {
    return res.render('index', { error: 'Please enter a city name.', city: null });
  }
  if (query.length > MAX_CITY_LENGTH) {
    return res.render('index', { error: `City name too long (max ${MAX_CITY_LENGTH} characters).`, city: null });
  }

  try {
    const location = await searchCity(query);
    if (!location) {
      return res.render('index', { error: `City "${query}" not found.`, city: null });
    }

    const forecast = await getForecast(location.latitude, location.longitude, location.timezone);
    forecast.location = location;

    res.render('weather', { forecast, error: null });
  } catch (err) {
    console.error(err);
    res.render('index', { error: `Failed to fetch weather: ${err.message}`, city: null });
  }
});

// Weather search (GET)
app.get('/weather', async (req, res) => {
  const query = (req.query.city || '').trim();
  if (!query) {
    return res.redirect('/');
  }
  if (query.length > MAX_CITY_LENGTH) {
    return res.render('error', { message: `City name too long (max ${MAX_CITY_LENGTH} characters).` });
  }

  try {
    const location = await searchCity(query);
    if (!location) {
      return res.render('error', { message: `City "${query}" not found.` });
    }

    const forecast = await getForecast(location.latitude, location.longitude, location.timezone);
    forecast.location = location;

    res.render('weather', { forecast, error: null });
  } catch (err) {
    console.error(err);
    res.render('error', { message: `Failed to fetch weather: ${err.message}` });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[weatherdash] Server running at http://localhost:${PORT}`);
  });
}

module.exports = { app };
