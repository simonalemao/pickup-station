var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
user: "www-pickup-station",
password: "Rasputin"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
