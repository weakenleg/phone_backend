const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3 // Minimum length of 3 characters
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (value) {
        // Custom validation function for the phone number
        // Regular expression pattern to match the desired format: XX-XXXXXXXX
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: 'Invalid phone number format. Please use the format XX-XXXXXXXX.',
    },
  },
  id: {
    type: String,
    required: true
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person



