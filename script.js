// Replace with your OpenWeatherMap API key
const API_KEY = '66e8311a9b39d1f1ad27c9a94fdd62ce';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const $ = id => document.getElementById(id);
const statusEl = $('status');
const weatherEl = $('weather');

function setStatus(msg, loading = false){
  statusEl.textContent = msg;
  statusEl.classList.toggle('loading', !!loading);
}
function clearStatus(){
  statusEl.textContent = '';
  statusEl.classList.remove('loading');
}

async function fetchWeatherByCity(city){
  setStatus('Loading...', true);
  try{
    const url = `${WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Location not found');
    const data = await res.json();
    displayWeather(data);
  }catch(err){
    setStatus(err.message, false);
    weatherEl.classList.add('hidden');
  }
}

async function fetchWeatherByCoords(lat, lon){
  setStatus('Loading...', true);
  try{
    const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Unable to fetch weather for your location');
    const data = await res.json();
    displayWeather(data);
  }catch(err){
    setStatus(err.message, false);
    weatherEl.classList.add('hidden');
  }
}

function animateCount(el, endValue, suffix = ''){
  const startText = el.textContent || '';
  const startMatch = startText.match(/(-?\d+)/);
  const start = startMatch ? Number(startMatch[1]) : 0;
  const duration = 600;
  const startTime = performance.now();

  function frame(now){
    const t = Math.min((now - startTime) / duration, 1);
    const current = Math.round(start + (endValue - start) * easeOutCubic(t));
    el.textContent = `${current}${suffix}`;
    if(t < 1) requestAnimationFrame(frame);
    else{
      el.textContent = `${Math.round(endValue)}${suffix}`;
    }
  }
  requestAnimationFrame(frame);
}

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function bump(el){
  el.classList.add('bump');
  setTimeout(()=> el.classList.remove('bump'), 320);
}

function displayWeather(data){
  clearStatus();
  weatherEl.classList.remove('hidden');
  // trigger fade-in animation
  weatherEl.classList.remove('visible');
  void weatherEl.offsetWidth; // force reflow
  weatherEl.classList.add('visible');

  $('city').textContent = data.name || '—';
  $('country').textContent = data.sys?.country || '';

  // animate numeric fields
  const tempVal = Math.round(data.main.temp);
  animateCount($('temp'), tempVal, '°C');
  bump($('temp'));

  const feelsVal = Math.round(data.main.feels_like);
  animateCount($('feels'), feelsVal, '°C');

  $('humidity').textContent = `${data.main.humidity}%`;
  $('wind').textContent = `${data.wind.speed} m/s`;
  $('desc').textContent = data.weather?.[0]?.description || '-';

  const iconCode = data.weather?.[0]?.icon;
  const iconEl = $('icon');
  if(iconCode){
    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    iconEl.classList.remove('hidden');
    // add floating animation
    iconEl.classList.add('floating');
  }else{
    iconEl.classList.add('hidden');
    iconEl.classList.remove('floating');
  }
}

// Event handlers
document.getElementById('search-form').addEventListener('submit', e => {
  e.preventDefault();
  const city = document.getElementById('city-input').value.trim();
  if(!city) return;
  fetchWeatherByCity(city);
});

document.getElementById('geo-btn').addEventListener('click', () => {
  if(!navigator.geolocation){
    setStatus('Geolocation not supported by your browser', false);
    return;
  }
  setStatus('Locating...', true);
  navigator.geolocation.getCurrentPosition(pos => {
    fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  }, err => {
    setStatus('Unable to retrieve your location', false);
  }, {timeout:10000});
});

// Optional: try a default city on first load
// fetchWeatherByCity('New York');
