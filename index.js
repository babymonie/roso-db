const compression = require("compression");
const io = require("socket.io");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const program = require("commander");
const server = require("./server");
function startServer(options)
{
    server.start(options);
}
program.name("CauseDB").version("0.0.1").description("A a ready to made json database with sql like queries");
program.command("start").description("Start the server").option("-p, --port <port>", "Port to listen on").option("-h, --host <host>", "Host to listen on").option("-pa, --password <password>", "Password to access the database,default is 123").option("-u, --username <username>", "Username to access the database, default is admin").action(function(options){
    var serverOptions = {
        port: options.port,
        host: options.host,
        password: options.password,
        username: options.username
    }
    if (!options.port) {
        serverOptions.port = 3000;
    }
    if (!options.host) {
        serverOptions.host = "localhost";
    }
    if (!options.password) {
        serverOptions.password = "123";
    }
    if (!options.username) {
        serverOptions.username = "admin";
    }
    if (!fs.existsSync(path.join(__dirname, "databases"))) {
        fs.mkdirSync(path.join(__dirname, "databases"));
    }
    startServer(serverOptions);
});
program.parse(process.argv);
if (program.args.length === 0) {
    program.help();
}

