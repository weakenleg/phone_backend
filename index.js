const express = require('express');
const app = express();
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');
app.use(cors());


const PORT = 3001;

app.use(express.json());
app.use(morgan('tiny'));
morgan.token('req-body', (req) => {
    return JSON.stringify(req.body);
  });
app.use(
morgan(':method :url :status :res[content-length] - :response-time ms :req-body')
);
const persons = [
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' },
  ];



app.get('/api/persons', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(persons);
});
  


app.get('/info', (request, response) => {
    const currentTime = new Date();
    const entryCount = persons.length;
  
    const infoHtml = `
      <p>Phonebook has info for ${entryCount} people</p>
      <p>${currentTime}</p>
    `;
    
    response.send(infoHtml);
  });
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
  
    if (person) {
      response.json(person);
    } else {
      response.status(404).json({ error: 'Person not found' });
    }
  });
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
  });
  app.post('/api/persons', (request, response) => {
    const { name, number } = request.body;
  
    // Check if name or number is missing
    if (!name || !number) {
      return response.status(400).json({ error: 'name or number is missing' });
    }
  
    // Check if name already exists in the phonebook
    const existingPerson = persons.find((person) => person.name === name);
    if (existingPerson) {
      return response.status(400).json({ error: 'name must be unique' });
    }
  
    const newPerson = {
      id: Math.floor(Math.random() * 1), // Generate a random ID
      name,
      number,
    };
  
    // Add the new phonebook entry to the list of entries
    persons.push(newPerson);
  
    response.status(200).json(persons);
  });
  

  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });