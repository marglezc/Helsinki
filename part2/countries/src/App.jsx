
import { useState, useEffect } from 'react'
import countriesService from './countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  // Filtrar países según lo escrito en el buscador
  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  // Obtener el país cuando solamente existe una coincidencia
  const countryToShow =
    countriesToShow.length === 1
      ? countriesToShow[0]
      : null

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
            </p>
          )
        }

        {/* Una sola coincidencia: mostrar información completa */}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default App
