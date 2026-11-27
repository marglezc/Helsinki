const express = require('express')
const cors = require('cors')
const app = express()
const blogsRouter = require('./controllers/blogs')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.get('/', (request, response) => {
  response.send('<h1>Blog List</h1>')
})

module.exports = app