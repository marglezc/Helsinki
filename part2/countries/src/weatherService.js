
import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'

const getWeather = (lat, lon) => {
  const api_key = import.meta.env.VITE_OPENWEATHER_API_KEY

  const request = axios.get(baseUrl, {
    params: {
      lat: lat,
      lon: lon,
      appid: api_key,
      units: 'metric',
      lang: 'es'
    }
  })

  return request.then(response => response.data)
}

export default { getWeather }
