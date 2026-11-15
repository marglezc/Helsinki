
import { useState, useEffect } from 'react'
import weatherService from './weatherService'

const Weather = ({ capital, coordinates }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!coordinates || coordinates.length !== 2) {
      setLoading(false)
      setError('No hay coordenadas disponibles para esta capital')
      return
    }

    setLoading(true)
    setWeather(null)
    setError(null)

    weatherService
      .getWeather(coordinates[0], coordinates[1])
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo obtener la información del clima')
        setLoading(false)
      })
  }, [coordinates])

  if (loading) {
    return <p>Loading weather...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!weather) {
    return null
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>

      <p>
        Temperature: {weather.main.temp} °C
      </p>

      <img
        src={iconUrl}
        alt={weather.weather[0].description}
      />

      <p>
        {weather.weather[0].description}
      </p>

      <p>
        Wind: {weather.wind.speed} m/s
      </p>
    </div>
  )
}

export default Weather
