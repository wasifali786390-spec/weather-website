# Weather — Global News Website

This is a small, responsive frontend weather app that uses the OpenWeatherMap API to fetch current weather by city name or by browser geolocation.

## Files
- [index.html](index.html#L1) — Main page
- [styles.css](styles.css#L1) — Styling
- [script.js](script.js#L1) — App logic (replace `YOUR_API_KEY_HERE` with your API key)

## Setup
1. Get a free API key from OpenWeatherMap: https://openweathermap.org/api
2. Open `script.js` and set `API_KEY` to your key.

## Run locally
It's best to serve the files via a simple HTTP server to ensure geolocation works consistently.

Using Python 3 (from repository root):

```bash
python -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Notes
- The app requests current weather (metric units). Change `units=metric` in `script.js` if you prefer Fahrenheit.
- For production, avoid embedding API keys in client-side JS. Use a small backend or serverless function to keep keys secret.

If you want, I can add a forecast view, a units toggle (C/F), or host this as a GitHub Pages site.