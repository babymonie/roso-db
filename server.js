const compression = require("compression");
const io = require("socket.io");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const socketioAuth = require("socketio-auth");
const express = require("express");
const app = express();
function createDatabase(args) {
  var databaseName = args.databaseName;
  var path = "./databases/" + databaseName;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      error: "Database already exists",
    };
  }
}
function createTable(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, "[]");
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      error: "Table already exists",
    };
  }
}
function insert(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var data = args.data;
  const newData ={
    id: Math.random().toString(36).substr(2, 9),
    ...data,
  };
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (fs.existsSync(path)) {
    var table = JSON.parse(fs.readFileSync(path));
    table.push(newData);
    fs.writeFileSync(path, JSON.stringify(table));
    return {
      success: true,
      result: newData,
    };
  } else {
    return {
      success: false,
      error: "Table doesn't exist",
    };
  }
}
function update(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var data = args.data;
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (fs.existsSync(path)) {
    var table = JSON.parse(fs.readFileSync(path));
    var index = table.findIndex(function (item) {
      return item.id === data.id;
    });
    if (index !== -1) {
      table[index] = data;
      fs.writeFileSync(path, JSON.stringify(table));
      return {
        success: true,
        result: data,
      };
    } else {
      return {
        success: false,
        error: "Item doesn't exist",
      };
    }
  } else {
    return {
      success: false,
      error: "Table doesn't exist",
    };
  }
}
function deleteFromTable(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var id = args.id;
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (fs.existsSync(path)) {
    var table = JSON.parse(fs.readFileSync(path));
    var index = table.findIndex(function (item) {
      return item.id === id;
    });
    if (index !== -1) {
      table.splice(index, 1);
      fs.writeFileSync(path, JSON.stringify(table));
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: "Item doesn't exist",
      };
    }
  } else {
    return {
      success: false,
      error: "Table doesn't exist",
    };
  }
}
function select(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var id = args.id;
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (fs.existsSync(path)) {
    var table = JSON.parse(fs.readFileSync(path));
    if (id) {
      var index = table.findIndex(function (item) {
        return item.id === id;
      });
      if (index !== -1) {
        return {
          success: true,
          result: table[index],
        };
      } else {
        return {
          success: false,
          error: "Item doesn't exist",
        };
      }

    } else {
      return {
        success: true,
        result: table,
      };
    }
  } else {
    return {
      success: false,
      error: "Table doesn't exist",
    };
  }
}
function dropTable(args) {
  var databaseName = args.databaseName;
  var tableName = args.tableName;
  var path = "./databases/" + databaseName + "/" + tableName + ".json";
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      error: "Table doesn't exist",
    };
  }
}
function dropDatabase(args) {
  var databaseName = args.databaseName;
  var path = "./databases/" + databaseName;
  if (fs.existsSync(path)) {
    fs.rmdirSync(path, { recursive: true });
    return {
      success: true,
    };
  } else {
    return {
      success: false,
      error: "Database doesn't exist",
    };
  }
}
function executeCommand(command, args) {
  var result = null;
  switch (command) {
    case "create db":
      result = createDatabase(args);
      break;
    case "create table":
      result = createTable(args);
      break;
    case "insert into table":
      result = insert(args);
      break;
    case "update row from table":
      result = update(args);
      break;
    case "delete from table":
      result = deleteFromTable(args);
      break;
    case "select from table":
      result = select(args);
      break;
    case "drop table":
      result = dropTable(args);
      break;
    case "drop db":
      result = dropDatabase(args);
      break;
    default:
      result = {
        error: "Invalid command",
      };
      break;
  }
  return result;
}
function start(options) {
  if (!options.port) {
    options.port = 3000;
  }
  if (!options.host) {
    options.host = "localhost";
  }
  if (!options.password) {
    options.password = "";
    console.log("Password can't be empty");
  }
  if (!options.username) {
    options.username = "admin";
  }
  var server = app.listen(options.port, options.host, function () {
    console.log(
      "Server started on port: " +
        options.port +
        " and host: " +
        options.host +
        " with username: " +
        options.username +
        " and password: " +
        options.password
    );
  });
  var socket = io(server).listen(server);
  const authenticate = async (client, data, callback) => {
    if (data.username === options.username && data.password === options.password) {
        callback(null, true);
    } else {
        callback(null, false);
    }
  };
  const postAuthenticate = client => {
    client.on("command", function (data) {
      var result = executeCommand(data.command, data.args);
      client.emit("result", result);
    });
  };
 socketioAuth(socket, { authenticate, postAuthenticate });

}
module.exports = {
  start: start,
};
