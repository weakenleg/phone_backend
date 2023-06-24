// const express = require('express');
// const app = express();
// const http = require('http');
// const morgan = require('morgan');
// const cors = require('cors');
// app.use(cors());
// app.use(express.static('build'));
// const baseUrl = '/api/persons'
// const Note = require('./mongo')
// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }
// const requestLogger = (request, response, next) => {
//     console.log('Request Method:', request.method)
//     console.log('Request Path:  ', request.path)
//     console.log('Request Body:  ', request.body)
//     console.log('---')
//     next()
// }

// const unknownEndpoint = (request, response) => {
//     response.status(404).send({ error: 'unknown endpoint' })
// }



// app.use(express.json());
// app.use(morgan('tiny'));
// app.use(requestLogger)
// app.use(express.static('build'))
// morgan.token('req-body', (req) => {
//     return JSON.stringify(req.body);
//   });
// app.use(
// morgan(':method :url :status :res[content-length] - :response-time ms :req-body')
// );
// const persons = [
//     { id: 1, name: 'Arto Hellas', number: '040-123456' },
//     { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
//     { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
//     { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
//   ];

// app.get('/', (req, res) => {
//     res.send('<h1>Phonebakend!</h1>')
// })

// app.get('/api/persons', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.json(persons);
// });
  


// app.get('/info', (request, response) => {
//     const currentTime = new Date();
//     const entryCount = persons.length;
  
//     const infoHtml = `
//       <p>Phonebook has info for ${entryCount} people</p>
//       <p>${currentTime}</p>
//     `;
    
//     response.send(infoHtml);
//   });
// app.get('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   const person = persons.find(person => person.id === id);

//   if (person) {
//     response.json(person);
//   } else {
//     response.status(404).json({ error: 'Person not found' });
//   }
// });
// app.delete('/api/persons/:id', (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter(person => person.id !== id);

//   response.status(204).end();
// });
// app.delete('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   console.log(id)
//   Person.findByIdAndRemove({ id })
//     .then(() => {
//       res.status(204).end();
//     })
//     .catch((error) => {
//       console.log('Error deleting person:', error.message);
//       res.status(500).send('Internal Server Error');
//     });
// });
// app.post('/api/persons', (request, response) => {
//   const { name, number } = request.body;

//   // Check if name or number is missing
//   if (!name || !number) {
//     return response.status(400).json({ error: 'name or number is missing' });
//   }

//   // Check if name already exists in the phonebook
  // const existingPerson = persons.find((person) => person.name === name);
  // if (existingPerson) {
  //   return response.status(400).json({ error: 'name must be unique' });
  // }

//   const newPerson = {
//     id: Math.floor(Math.random() * 1), // Generate a random ID
//     name,
//     number,
//   };

//   // Add the new phonebook entry to the list of entries
//   persons.push(newPerson);

//   response.status(200).json(persons);
// });
  

  
// app.use(unknownEndpoint)

// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./model/person');
require('dotenv').config();

const { Types } = mongoose;

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));

const url = process.env.MONGODB_URI;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

app.get('/', (req, res) => {
  res.send('<h1>Phonebakend!</h1>');
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      console.log('Error fetching persons:', error.message);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      const infoHtml = `
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `;
      res.send(infoHtml);
    })
    .catch(next);
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const _id = req.params._id;
  console.log(_id)
  console.log(id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  Person.findOne({ id }) // Use findOne instead of findById
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(next);
});


app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const _id = req.params._id;
  console.log(_id)
  console.log(id)

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  Person.findOneAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log('Error deleting person:', error.message);
      res.status(500).send('Internal Server Error');
    });
});


app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  console.log('ID:', id); // Print the ID to the console
  const { name, number } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  // const existingPerson = persons.find((person) => person.name === name);
  // if (existingPerson) {
  //   return response.status(400).json({ error: 'name must be unique' });
  // }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(next);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const newPerson = new Person({
    id: new mongoose.Types.ObjectId(), // Generate a new ObjectId
    name,
    number,
  });

  newPerson.save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => {
      console.log('Error saving person:', error); // Print the error to the console
      res.status(500).send('Internal Server Error');
    });
});


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


