const { writeFileSync, readFile } = require('fs')

const path = "daten.json";
const leereDaten = {
   "boxen": {
      "1": {
         "id": 1,
         "title": "",
         "description": "",
         "size": "s",
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

   getBelegteBoxen() {
      var res = [];

      this.#get("belegte").forEach(belegt => {
         res.push(this.#get("boxen")[belegt]);
      });

      return JSON.stringify(res);
   }

   open(id) {
      return this.#arduino.open(id);
   }

   async getBox(id) {
      var status;
      do {
         status = await this.#arduino.getStatus()
      } while (status == "{}")

      status = JSON.parse(status);

      var box = this.#get("boxen")[`${id}`]

      box["state"] = status[id]; 

      return JSON.stringify(box);
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
}
