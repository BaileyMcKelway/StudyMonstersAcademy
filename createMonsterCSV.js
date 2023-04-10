const fs = require('fs');
const { faker } = require('@faker-js/faker');
// const User = require('./models/User');

// Generate some sample data
const monsters = [];
for (let i = 1; i <= 50000; i++) {
  const user = {
    id: faker.datatype.uuid(),
    experience: 0,
    memory: 0,
    comprehension: 0,
    type: 'Banana',
    level: 0,
    knowledge: 'bananas',
    metadata: JSON.stringify({}),
    createdAt: '2023-04-09 12:13:38.695-04',
    updatedAt: '2023-04-09 12:13:38.695-04',
  };
  monsters.push(user);
}

const csvRows = monsters.map((monster) => Object.values(monster));
const csvData = [...csvRows];
const csvText = csvData.map((row) => row.join(',')).join('\n');
fs.writeFileSync('monsters.csv', csvText, 'utf-8');
