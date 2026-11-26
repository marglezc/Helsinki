
const mongoose = require('mongoose')

const password = process.argv[2]

const uri = `mongodb+srv://a19201105_db_user:${encodeURIComponent(password)}@phonebook.fp28agx.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(uri)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const main = async () => {
  try {
    if (process.argv.length === 3) {
      const persons = await Person.find({})

      console.log('phonebook:')

      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
    } else if (process.argv.length === 5) {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })

      const savedPerson = await person.save()

      console.log(
        `added ${savedPerson.name} number ${savedPerson.number} to phonebook`
      )
    } else {
      console.log('Invalid number of arguments')
    }
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

main()
