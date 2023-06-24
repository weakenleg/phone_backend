const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  // const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.log('Error saving person:', error.message)
    })
}

if (process.argv.length === 3) {
  // const password = process.argv[2]

  Person.find({})
    .then((persons) => {
      console.log('Phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.log('Error retrieving persons:', error.message)
    })
}

if (process.argv.length === 6 && process.argv[2] === 'delete') {
  // const password = process.argv[3]
  const name = process.argv[4]
  const number = process.argv[5]

  Person.findOneAndDelete({ name: name, number: number })
    .then(() => {
      console.log(`Deleted ${name} number ${number} from phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.log('Error deleting person:', error.message)
    })
}
