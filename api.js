const path = require('path');
const config = require('./config');

const apiStore = {
  commands: {},
};

function getDatabasePath(databaseName) {
  const dbPath = path.join(config.dataPath, databaseName);

  return dbPath;
}

function registerCommand(command) {
  const { name } = command;

  apiStore.commands[name] = command;
};

function databaseExists(databaseName) {
  const dbPath = getDatabasePath(databaseName);

  return fs.existsSync(dbPath);
};

function createDatabase(databaseName) {
  const dbPath = getDatabasePath(databaseName);

  fs.mkdirSync(dbPath);
}

function executeCommand(name, args) {
  const command = apiStore.commands[name];

  if (command) {
    return command.run(callback, args);
  }

  return { error: 'Invalid command' };
}

module.exports = {
  registerCommand,
  executeCommand,
  getDatabasePath,
  databaseExists,
  createDatabase,
};
