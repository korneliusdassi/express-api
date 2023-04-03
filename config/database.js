let mysql = require('mysql');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_express_api',
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log('Databases Connected Successfully!');
  }
});

module.exports = connection;
