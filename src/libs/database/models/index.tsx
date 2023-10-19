import User from './User';
import Essays from './Essays';
import Monster from './Monster';
import Notes from './Notes';

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

export default { User, Essays, Monster, Notes };
