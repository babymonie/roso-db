
require('dotenv').config();
var os = require('os');
const userInfo = os.userInfo();
const defaultDataPath = `C:\\Users\\${userInfo.username}\\AppData\\Roaming\\npm\\node_modules\\roso-db`;
const dataPath = process.env.DATA_PATH || defaultDataPath;

module.exports = {
    dataPath,
}
