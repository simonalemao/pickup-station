const mysql = require('mysql');

export class Daten {
   constructor() {
      this.arduino = new (require('./Devuino.js').Arduino)();

      this.con = mysql.createConnection({
         host: "localhost",
         user: "www-pickup-station",
         password: "Rasputin",
         database: "pickup-station"
      });

      this.con.connect((err) => {
         if (err) {
            console.error(err);
         };
      });
   }

   setArduIp(ip) {
      this.arduino.setIp(ip);
   }

   getBelegteBoxen(Response) {
      this.con.query("SELECT * FROM boxen WHERE belegt = 1", (err, rows) => {
         if (err) {
            console.error(err)
            Response.end("null")
         } else {
            Response.end(JSON.stringify(rows))
         }

      })
   }

   getArduinoAvailability(Response) {
      this.arduino.getAvailability(Response)
   }

   open(res, boxID) {
      this.arduino.open(boxID).then(
         this.con.query(`UPDATE boxen SET geoeffnet = '${this.#currentTime()}' WHERE boxID = ${boxID}`, (err, rows) => {
            if (err) { console.error(err); }
            res?.end()
         })
      )
   }

   getBox(Response, boxID) {
      this.arduino.getStatus().then((arduStatus) => {
         this.con.query(`SELECT * FROM boxen WHERE boxID = ${boxID}`, (err, rows) => {
            if (err) {
               console.error(err);
               Response.end("null")
            } else {
               let arduStat = JSON.parse(arduStatus);

               Response.end(JSON.stringify({
                  ...(rows[0]),
                  offen: arduStat[boxID - 1]
               }))
            }
         })
      })
   }

   boxFreigeben(Response, boxID) {
      this.con.query(`UPDATE boxen SET belegt = 0 WHERE boxID = ${boxID}`
         , (err, rows) => {
            if (err) { console.error(err); }
            Response.end()
         }
      )
   }

   getVerfuegbare(Response) {
      this.con.query("SELECT groesse FROM boxen WHERE belegt = 0 GROUP BY groesse", (err, rows) => {
         var verf = {
            S: false,
            M: false,
            L: false
         }

         if (err) {
            console.error(err)
         } else {
            rows.forEach(row => {
               verf[row.groesse] = true
            });
         }

         Response.end(JSON.stringify(verf))
      })
   }

   requestAndOpen(Response, groesse) {
      this.con.query(`SELECT boxID, listID 
         FROM boxen WHERE 
         (belegt = 0)
         AND (groesse = '${groesse}')
         LIMIT 1`, (err, rows) => {
         if (err) {
            console.error(err);
            Response.end("null");
         }

         var listID = rows[0].listID
         var boxID = rows[0].boxID

         // BELEGT = 1 !!
         this.con.query(`UPDATE boxen SET
         titel = 'Kein Titel vergeben',
         beschreibung = 'Keine Beschreibung vergeben',
         belegt = 0,
         typ = 'Public',
         erstellt = '${this.#currentTime()}',
         geoeffnet = '${this.#currentTime()}',
         offen = 1
         WHERE listID = ${listID}`, (err, rows) => {
            if (err) {
               console.error(err);
            }

            this.con.query(`
            SELECT * FROM boxen WHERE listID = ${listID}`, (err, rows) => {
               if (err) {
                  console.error(err);
               }

               this.arduino.open(boxID).then(
                  Response.end(JSON.stringify(rows[0]))
               )
            })
         })

      })
   }

   async update(Response, payload) {
      this.con.query(
         `UPDATE boxen SET 
         titel = ?, 
         beschreibung = ? 
         WHERE boxID = ${payload.boxID}`
         , [payload.titel, payload.beschreibung]
         , (err, rows) => {
            if (err) { console.error(err) }
            Response.end()
         }
      )
   }

   #currentTime() {
      var date = new Date();

      return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.` +
         `${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}.` +
         `${date.getFullYear()} ` +
         `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:` +
         `${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
   }
}
