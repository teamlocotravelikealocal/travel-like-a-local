const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const mysqlConfig = require('./config.js');
const connection = mysql.createConnection(mysqlConfig);

console.log('mysqlConfig is...', mysqlConfig);
// console.log('db connection is...', connection);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

exports.connection = connection;
