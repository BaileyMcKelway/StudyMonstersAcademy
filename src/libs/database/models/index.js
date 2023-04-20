const User = require('./User');
const Essays = require('./Essays');
const Monster = require('./Monster');
const Notes = require('./Notes');

User.hasOne(Monster, { foreignKey: 'user_id_and_type' });

User.hasMany(Notes, {
  foreignKey: {
    name: 'user_id_and_type',
  },
});

User.hasMany(Essays, {
  foreignKey: {
    name: 'user_id_and_type',
  },
});

module.exports = { User, Essays, Monster, Notes };
