const fs = require('fs');
const { faker } = require('@faker-js/faker');
// const User = require('./models/User');

// Generate some sample data
const notes = [];
for (let i = 1; i <= 200000; i++) {
  const note = {
    id: faker.datatype.uuid(),
    quality: 0,
    text: 'sflklkfjseklsfljkeslkjf',
    subject: 'slkfelskfmnklseflkesf',
    category: 'Banana',
    ideas: 'dslkjklefjslkesjf',
    user_id: faker.datatype.uuid(),
    createdAt: '2023-04-09 12:13:38.695-04',
    updatedAt: '2023-04-09 12:13:38.695-04',
  };
  notes.push(note);
}

const csvRows = notes.map((note) => Object.values(note));
const csvData = [...csvRows];
const csvText = csvData.map((row) => row.join(',')).join('\n');
fs.writeFileSync('notes.csv', csvText, 'utf-8');
