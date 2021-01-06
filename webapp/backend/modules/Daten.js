const { writeFileSync, readFile } = require('fs')

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
         "state": 1 // 1 = geschlossen
      }
   },
   "belegte": []
}

export class Daten {
   #daten = {};
   #arduino;

   constructor() {
      this.#daten = this.#readFromFile();
      this.#arduino = new (require('./Arduino.js').Arduino)();
   }

   arduino() {
      return this.#arduino.getStatus();
   }

   async getBelegteBoxen() {
      var res = [];

      this.#get("belegte").forEach(belegt => {
         res.push(this.#get("boxen")[belegt]);
      });

      return JSON.stringify(res);
   }

   open(id) {
      var boxen = this.#get("boxen");

      boxen[`${id}`]["last_opened_at"] = this.#currentDate();

      this.#set({ "boxen": boxen });

      return this.#arduino.open(id);
   }

   async getBox(id) {
      var status = JSON.parse(await this.#arduino.getStatus());

      var box = this.#get("boxen")[`${id}`]

      box["state"] = status[id];

      return JSON.stringify(box);
   }

   async boxFreigeben(id) {
      var belegteNeu;

      this.#get("belegte").forEach(belegtAlt => {
         if (belegtAlt != `${id}`) {
            belegteNeu.push(`${id}`);
         }
      });

      this.#set({ "belegte": belegteNeu });

      return
   }

   async getVerfuegbare() {
      var boxen = this.#get("boxen");

      var verf = {
         "S": false,
         "M": false,
         "L": false
      }

      var belegte = this.#get("belegte");

      for (box in boxen) {
         if (!Array.includes(belegte, `${box.id}`)) {
            verf[box.size] = true;
         }
      }

      return JSON.stringify(verf);
   }

   async getBoxMitGroesse(groesse) {
      var boxen = this.#get("boxen");

      var belegte = this.#get("belegte");

      var resBox;

      for (box in boxen) {
         if (!Array.includes(belegte, `${box.id}`) && box.size == groesse) {
            resBox = box;
         }
      }

      resBox.created_at = this.#currentDate();
      resBox.last_opened_at = this.#currentDate();

      boxen[`${resBox.id}`] = resBox;

      this.#set({ "boxen": boxen });

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

      readFile(path, 'utf8', (err, fileData) => {
         if (err) {
            if (err.code === "ENOENT") {
               this.#writeToFile();
            } else {
               throw err;
            }
         } else {
            data = JSON.parse(fileData);
         }
      })

      return data;
   }

   #writeToFile() {
      writeFileSync(path, JSON.stringify(this.#daten))
   }

   #currentDate() {
      var date = new Date();

      return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
   }
}
