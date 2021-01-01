import { runInNewContext } from 'vm';

const { get } = require('http');
const { execSync } = require('child_process');

export class Arduino {
   #arduMAC = '8c:aa:b5:89:c6:c0';
   #arduIP;
   #arpCommand = 'arp -a';

   constructor() {
      this.#arduIP = this.#getArduIp();
   }

   async getStatus() {
      var result = "";

      var prom = new Promise((success, reject) => {
         var req = get(`http://${this.#arduIP}`, (incMes) => {
            incMes.on("data", (chunk) => {
               result += chunk;
            })

            incMes.on("end", () => {
               success(result);
            })
         })

         req.on("error", (err) => {
            reject(err);
         });
      });

      

      return prom;
   }

   #getArduIp() {
      var arduIp = null;

      try {
         var arp = execSync(this.#arpCommand).toString();
      } catch (error) {
         console.log(error.message);
      }

      var lines = arp.split("\n");

      lines.forEach(line => {
         if (line.indexOf(this.#arduMAC) > 0) {
            arduIp = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
         }
      });

      return arduIp;
   }
}