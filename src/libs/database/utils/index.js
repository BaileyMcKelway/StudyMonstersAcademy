const createUser = require('./createUser');
const getMonster = require('./getMonster');
const getNotes = require('./getNotes');
const getEssays = require('./getEssays');
const createNote = require('./createNote');
const createEssay = require('./createEssay');
const updateMonster = require('./updateMonster');
const deleteNotes = require('./deleteNotes');
const resetMonster = require('./resetMonster');

module.exports = {
  createUser,
  createNote,
  createEssay,
  getMonster,
  getNotes,
  getEssays,
  updateMonster,
  deleteNotes,
  resetMonster,
};
