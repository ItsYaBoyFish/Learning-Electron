const Sequelize = require('sequelize');
const clc = require('cli-color');


var db = new Sequelize("test", "ce", "1456", {
  host: 'localhost',
  dialect: 'mssql',
});

db
.authenticate()
.then(() => {
  console.log(clc.green(`DB Connection: File => "connection.js" - Connection has been established successfully, DB: test`));
})
.catch(err => {
  console.error(clc.red(`DB Connection: File => "connection.js" - Unable to connect to the database:  DB:  Test`, err));
});

  module.exports = db;