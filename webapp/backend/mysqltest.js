var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "www-pickup-station",
  password: "Rasputin",
  database: "pickup-station"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});
