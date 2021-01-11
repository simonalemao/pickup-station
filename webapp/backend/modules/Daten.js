const { writeFileSync, readFileSync } = require('fs')

const path = "daten.json";
const leereDaten = {
   "boxen": {
      "1": {
         "id": 1,
         "title": "",
         "description": "",
         "size": "S",
         "created_at": "",
         "last_opened_at": "",
         "state": 0 // 1 = offen
      }
   },
   "belegte": []
}

export class Daten {
   #daten;
   #arduino;

   constructor() {
      this.#daten = this.#readFromFile();
      this.#arduino = new (require('./Arduino.js').Arduino)();
   }

   async getBelegteBoxen() {
      var res = [];

      var boxen = this.#get("boxen");

      this.#get("belegte").forEach(belegt => {
         res.push(boxen[belegt]);
      });

      return JSON.stringify(res);
   }

   async open(id) {
      var boxen = this.#get("boxen");

      var isOpen = false;
      var tryCount = 5;
      boxen[`${id}`]["last_opened_at"] = this.#currentTime();
      this.#set({ "boxen": boxen });

      while (!isOpen && tryCount >= 0) {
         try {
            await this.#arduino.open(id);
            isOpen = true;

            boxen[`${id}`]["last_opened_at"] = this.#currentTime();
            this.#set({ "boxen": boxen });
         } catch (error) {
            if (error == "arduIP == null") {
               tryCount--;
               this.#arduino.arduIpErneuern();
            } else if (error == "timeout") {
               tryCount--;
               this.#arduino.arduIpErneuern();
            } else if (error == "other error") {
               tryCount = -1;
            }
         }
      }
   }

   async getBox(id) {
      var arduStat;

      var tryCount = 2;
      while (arduStat == undefined) {
         try {
            arduStat = await this.#arduino.getStatus();
         } catch (error) {
            if (error == "arduIP == null") {
               tryCount--;
               this.#arduino.arduIpErneuern();
            } else if (error == "timeout") {
               tryCount--;
               this.#arduino.arduIpErneuern();
            } else if (error == "other error") {
               tryCount = 0;
            }

            if (tryCount == 0) {
               // zurückgeben, dass alle Fächer geschlossen sind.
               arduStat = "[";
               Object.keys(this.#get("boxen")).forEach(box => {
                  arduStat += "0,";
               });
               arduStat += "0]";
            }
         }
      }

      arduStat = JSON.parse(arduStat);

      var box = this.#get("boxen")[`${id}`]

      box["state"] = arduStat[id - 1];

      return JSON.stringify(box);
   }

   async boxFreigeben(id) {
      var belegteNeu = [];

      this.#get("belegte").forEach(belegtAlt => {
         if (belegtAlt != `${id}`) {
            belegteNeu.push(`${id}`);
         }
      });

      this.#set({ "belegte": belegteNeu });

      this.#arduino.freigeben(id);
   }

   async getVerfuegbare() {
      var boxen = this.#get("boxen");

      var verf = {
         "S": false,
         "M": false,
         "L": false
      }

      var belegte = this.#get("belegte");

      Object.keys(boxen).forEach(boxStr => {
         if (belegte.indexOf(`${boxen[boxStr].id}`) == -1) {
            verf[boxen[boxStr].size] = true;
         }
      })

      return JSON.stringify(verf);
   }

   async getBoxMitGroesse(groesse) {
      // Daten zum ermittel "getten"
      var boxen = this.#get("boxen");
      var belegte = this.#get("belegte");

      // leere Box für Antwort auf Anfrage
      var resBox;

      // Nach einer unbenutzten Box suchen
      Object.keys(boxen).forEach(boxStr => {
         if ((belegte.indexOf(`${boxen[boxStr].id}`) == -1) && boxen[boxStr].size == groesse) {
            resBox = boxen[boxStr];
         }
      })

      // Infos für zurückzugebende Box ändern
      resBox.created_at = this.#currentTime();
      resBox.last_opened_at = this.#currentTime();
      resBox.title = "Kein Titel vorhanden";
      resBox.description = "Keine Beschreibung vorhanden.";

      // Zurückzugebende Box in Datenset speichern
      boxen[`${resBox.id}`] = resBox;
      // Box als belegt speichern
      belegte.push(`${resBox.id}`);

      // Daten speichern (& in Datei schreiben)
      this.#set({ "boxen": boxen });
      this.#set({ "belegte": belegte });

      // Box zurückgeben
      return resBox;
   }

   async update(payloadStr) {
      var pl = JSON.parse(payloadStr);
      var boxen = this.#get("boxen");

      boxen[`${pl.boxId}`]["title"] = pl.title;
      boxen[`${pl.boxId}`]["description"] = pl.description;

      this.#set({ "boxen": boxen });

      return
   }

   #get(keyStr) {
      var returnVar = this.#daten[keyStr];
      return returnVar == undefined ? null : returnVar;
   }

   #set(obj) {
      Object.assign(this.#daten, obj);
      this.#writeToFile();
   }

   #readFromFile() {
      var data = leereDaten;

      // readFile(path, 'utf8', (err, fileData) => {
      //    if (err) {
      //       if (err.code === "ENOENT") {
      //          this.#writeToFile();
      //       } else {
      //          throw err;
      //       }
      //    } else {
      //       data = JSON.parse(fileData);
      //    }
      // })

      try {
         data = JSON.parse(readFileSync(path, 'utf8'));
      } catch (error) {
         if (error.code === "ENOENT") {
            this.#writeToFile();
         }
      }

      return data;
   }

   #writeToFile() {
      writeFileSync(path, JSON.stringify(this.#daten))
   }

   #currentTime() {
      var date = new Date();

      return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}.`+
      `${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}.`+
      `${date.getFullYear()} `+
      `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:`+
      `${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
   }
}
