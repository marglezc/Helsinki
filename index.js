
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')
const errorHandler = require('./errorHandler')

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const app = express()

morgan.token('body', (request) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

const persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const PORT = process.env.PORT || 3001

// Obtener todos los contactos
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Agregar un nuevo contacto
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Actualizar un contacto
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Obtener un contacto por ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({
          error: 'person not found'
        })
      }
    })
    .catch(error => next(error))
})

// Eliminar un contacto
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Información de la agenda
app.get('/info', (request, response) => {
  const currentTime = new Date()

  Person.countDocuments({})
    .then(numberOfPersons => {
      response.send(`
        <p>Phonebook has info for ${numberOfPersons} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

// Middleware de manejo de errores
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
