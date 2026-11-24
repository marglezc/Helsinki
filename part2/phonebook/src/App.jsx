
import { useState, useEffect, useRef } from 'react'
import personsService from './persons'

// Componente para filtrar contactos
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with: <input
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

// Componente para agregar contactos
const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number: <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

// Componente para mostrar contactos
const Persons = ({ persons, removePerson }) => {
  return (
    <>
      {persons.map(person =>
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => removePerson(person.id)}>
            delete
          </button>
        </p>
      )}
    </>
  )
}

// Componente para mostrar notificaciones
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const notificationTimeout = useRef(null)

  // Mostrar notificaciones durante 5 segundos
  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message)
    setNotificationType(type)

    clearTimeout(notificationTimeout.current)

    notificationTimeout.current = setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  // Obtener contactos del servidor
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        showNotification('Error loading phonebook data', 'error')
      })
  }, [])

  // Agregar contactos
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      window.alert(`${newName} is already added to phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(currentPersons =>
          currentPersons.concat(returnedPerson)
        )

        setNewName('')
        setNewNumber('')

        showNotification(
          `${returnedPerson.name} added successfully`,
          'success'
        )
      })
      .catch(error => {
        showNotification(
          'Error adding person',
          'error'
        )
      })
  }

  // Eliminar contactos
  const removePerson = (id) => {
    const person = persons.find(person => person.id === id)

    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (confirmDelete) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(currentPersons =>
            currentPersons.filter(person => person.id !== id)
          )
        })
        .catch(error => {
          showNotification(
            `Error deleting ${person.name}`,
            'error'
          )
        })
    }
  }

  // Controlar cambios en los campos
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Filtrar contactos
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notificationMessage}
        type={notificationType}
      />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App
