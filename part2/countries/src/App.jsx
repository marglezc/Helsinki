
import { useState, useEffect } from 'react'
import countriesService from './countries'
import Weather from './Weather'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  // Filtrar países según la búsqueda
  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  // Determinar qué país se debe mostrar
  const countryToShow = selectedCountry ||
    (countriesToShow.length === 1 ? countriesToShow[0] : null)

  return (
    <div>
      <h2>Find countries</h2>

      <div>
        find countries: <input
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div>
        {/* Más de 10 coincidencias */}
        {countriesToShow.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {/* Entre 2 y 10 coincidencias */}
        {countriesToShow.length <= 10 &&
          countriesToShow.length > 1 &&
          countriesToShow.map(country =>
            <p key={country.cca3}>
              {country.name.common}

              <button
                onClick={() => setSelectedCountry(country)}
              >
                show
              </button>
            </p>
          )
        }

        {/* Información del país seleccionado */}
        {countryToShow && (
          <div>
            <h2>{countryToShow.name.common}</h2>

            <p>
              Capital: {countryToShow.capital?.join(', ')}
            </p>

            <p>
              Area: {countryToShow.area}
            </p>

            <h3>Languages:</h3>

            <ul>
              {Object.values(countryToShow.languages || {}).map(language =>
                <li key={language}>{language}</li>
              )}
            </ul>

            <img
              src={countryToShow.flags.png}
              alt={`Flag of ${countryToShow.name.common}`}
              width="150"
            />

            {/* Información meteorológica de la capital */}
            {countryToShow.capital?.[0] && (
              <Weather
                capital={countryToShow.capital[0]}
                coordinates={countryToShow.capitalInfo?.latlng}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
