
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

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

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
        {countriesToShow.map(country =>
          <p key={country.cca3}>
            {country.name.common}
          </p>
        )}
      </div>
    </div>
  )
}

export default App
