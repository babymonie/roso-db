
## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
## Authors

- [@thatfriendlyasiandev](https://www.github.com/babymonie)
- [waitingwittykitty](https://www.github.com/waitingwittykitty)


# ROSO DB

ROSODB is a database that uses a combination of SQL and JSON. It is easy to use, making it a great choice for those who need a simple database solution.
you may have also known about my other project causedb well, here's it brother, better lighter faster and more secure.


## Tech Stack

**Client:** NODE.JS

**Server:** Node, Express


## Installation

Install rosodb with npm

```bash
  npm install rosodb
```
    
## Usage/Examples

```bash
  #Look at the commands

  roso --help

  #Run it

  cause -h any hostname -p any port -username for connection -pa password for connection
```

## How to create your own custom extensions/commands

```bash
  #create a file and name it whatever you want and then paste this baseplate code in It,check the api.js docs below for more info.
  const api = require('roso-db/api')
  const command = {
    name: 'create db',
    description: 'Create a database',
    args: ['databaseName'],
    run: async (callback, args) => {
      const databaseName = args.databaseName;

      if (!api.databaseExists(databaseName)) {
        api.createDatabase(databaseName);
        callback({
          success: true,
        });
      } else {
        callback({
          success: false,
          error: `Database [${databaseName}] already exists`,
        });
      }
    },
  };

  api.registerCommand(command);

  api.executeCommand('create db', { databaseName: 'users' });

  //output
  {
    success: true,
  }

  #this command is a prebuilt command in rosodb so you can use it as a reference for your own commands.
```
## How to Import custom extensions/commands

### drag and drop the extension file to the commands folder wherever the database server is running, and then restart the server commands will automatically be imported.

## API Reference

#### Get all databases
```bash
  api.getDatabases();
```
#### Check if database exists
```bash
  api.databaseExists(databaseName);
```
#### Create a database
```bash
  api.createDatabase(databaseName);
```
#### Delete a database
```bash
  api.dropDatabase(databaseName);
```
#### Get all tables in a database
```bash
  api.getTables(databaseName);
```
#### Check if table exists in a database
```bash
  api.tableExists(databaseName, tableName);
```
#### Create a table in a database
```bash
  api.createTable(databaseName, tableName, columns);
```
#### Delete a table in a database
```bash
  api.dropTable(databaseName, tableName);
```
#### Update a row in a database
```bash
  api.updateTable(databaseName, tableName, rowId, data);
```
#### Get a row by an id in a table in a database
```bash
  api.selectFromTableById(databaseName, tableName);
```
#### Get all rows in a table in a database
```bash
  api.getRows(databaseName, tableName);
```
#### Get a row by an query in a table in a database
```bash
  api.selectFromTableByQuery(databaseName, tableName, query);
```
#### Insert a row in a table in a database
```bash
  api.insertIntoTable(databaseName, tableName, row);
```
#### Delete a row in a table in a database, only takes id to make sure that you don't delete the wrong row
```bash
  api.deleteFromTable(databaseName, tableName, id);
```
#### Register a command
```bash
  api.registerCommand(command);
```
#### Execute a command
```bash
  api.executeCommand(commandName, args);
```

## Features

- SQL Based comamnds
- Fast
- Light
- JSON Storage

## Appendix

Clients for more languages are coming soon.


## FAQ

#### How good is the speed

Decent,better than CauseDB.

#### Why should i use the database?

First of all its, made to be used on simple projects and client and server hosted on the same device,meaning if you hosted an api in a server the database server would also,be hosted there.
## Feedback

If you have any feedback, please reach out to us at fake@fake.com

