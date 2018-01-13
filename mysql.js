var exports = module.exports = {};

mysql = require('mysql');

// MySQL Connection info
connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    database : ''
});

// Connection to MySQL.
connection.connect(function(err) { if (err) { console.error('error connecting: ' + err.stack); return; } console.log('Connected to MySQL-Server'); });