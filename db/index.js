const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
require('dotenv').config();
// const mysqlConfig = require('./config.js').mysqlConfig;
var mysqlConfig;
if ( process.env.NODE_ENV === 'development') {
   mysqlConfig = {
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
  };
} else {
  mysqlConfig = process.env.CLEARDB_DATABASE_URL;
}


const connection = mysql.createConnection(mysqlConfig);

// console.log('mysqlConfig is...', mysqlConfig);
// console.log('db connection is...', connection);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

exports.connection = connection;