const fs = require('fs');
const { faker } = require('@faker-js/faker');
// const User = require('./models/User');

// Generate some sample data
const users = [];
for (let i = 1; i <= 50000; i++) {
  const user = {
    user_id: faker.datatype.uuid(),
    discord_channel_id: faker.random.alphaNumeric(10),
    subscription: 'FALSE',
    paywall: 'FALSE',
    createdAt: '2023-04-09 12:13:38.695-04',
    updatedAt: '2023-04-09 12:13:38.695-04',
  };
  users.push(user);
}

const csvRows = users.map((user) => Object.values(user));
const csvData = [...csvRows];
const csvText = csvData.map((row) => row.join(',')).join('\n');
fs.writeFileSync('users.csv', csvText, 'utf-8');
