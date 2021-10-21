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

con.query("SELECT * FROM boxen", (err, rows) => {
  if (err) throw err;
  console.log(rows);
})

// Liefert:
const ergebnis = [
  {
    listID: 1,
    stationID: 1,
    boxID: 1,
    titel: 'Kein Titel vergeben',
    beschreibung: 'Keine Beschreibung vergeben',
    belegt: 0,
    groesse: 'S',
    typ: 'Public',
    erstellt: '07.10.2021 22:34',
    geoeffnet: '07.10.2021 22:34',
    offen: 1
  }
]

setTimeout(() => {
  process.exit()
}, 500);