const fs = require('fs');
const { faker } = require('@faker-js/faker');
// const User = require('./models/User');

// Generate some sample data
const essays = [];
for (let i = 1; i <= 200000; i++) {
  const essay = {
    id: faker.datatype.uuid(),
    title: 'sdlfkjselkfj',
    text: 'sflklkfjseklsfljkeslkjf',
    category: 'Banana',
    createdAt: '2023-04-09 12:13:38.695-04',
    updatedAt: '2023-04-09 12:13:38.695-04',
  };
  essays.push(essay);
}

const csvRows = essays.map((essay) => Object.values(essay));
const csvData = [...csvRows];
const csvText = csvData.map((row) => row.join(',')).join('\n');
fs.writeFileSync('essays.csv', csvText, 'utf-8');
