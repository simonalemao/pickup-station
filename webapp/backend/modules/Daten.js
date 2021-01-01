const { rootdir } = require('../rootdir.js');
const { readFileSync, writeFileSync } = require('fs')

export class Daten {
   #daten = {};

   constructor() {
      Object.assign(this.#daten, this.#readFromFile());
      this.set({ "belegte": ["box1"] })
   }

   /**
    * 
    * @param {String} keyStr 
    */
   get(keyStr) {
      var returnVar = this.#daten[keyStr];
      return returnVar == undefined ? null : returnVar;
   }

   getBelegteBoxen() {
      var res = [];

      this.#daten["belegte"].forEach(belegt => {
         res.push(this.#daten["boxen"][belegt]);
      });

      return JSON.stringify(res);
   }

   set(obj) {
      Object.assign(this.#daten, obj);
      this.#writeToFile();
   }

   #readFromFile() {
      return JSON.parse(readFileSync(rootdir + "/daten.json").toString());
   }

   #writeToFile() {
      writeFileSync(rootdir + "/daten.json", JSON.stringify(this.#daten))
   }

   show() {
      console.log(this.#daten);
   }
}
