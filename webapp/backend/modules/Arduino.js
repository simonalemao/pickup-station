const { request } = require('http');
const { execSync } = require('child_process');

export class Arduino {
   #arduMAC = '8c:aa:b5:89:c6:c0';
   #arpCommand = 'arp -a';
   #arduIP;

   constructor() {
      this.#arduIP = this.#getArduIP();
   }

   getStatus() {
      var prom = this.#getPromise("");

      var res = await prom;
      if (res == "{}") {
         this.#arduIP = this.#getArduIP();
         prom = this.#getPromise("");
      }

      return prom;
   }

   open(id) {
      return this.#getPromise(`o${id}`)
   }

   #getPromise(pathOhneSlash) {
      return new Promise(result => {
         var req = request({
            "hostname": this.#arduIP,
            "path": `/${pathOhneSlash}`,
            "timeout": 5000,
            "headers": {
               "identification": "4ef8487cc93a9a9e"
            }
         }, (incMes) => {
            var resultData = "";

            incMes.on("data", (chunk) => {
               resultData += chunk;
            })

            incMes.on("end", () => {
               result(resultData);
            })
         });

         req.on("timeout", () => {
            req.destroy();
            console.log("timeout");
            result("{}");
         });

         req.on("error", (err) => {
            req.destroy();
            console.log(`E: ${err}`);
            result("{}");
         });

         req.end();
      });
   }

   #getArduIP() {
      var arduIP = null;

      try {
         var arp = execSync(this.#arpCommand).toString();
         var lines = arp.split("\n");

         lines.forEach(line => {
            if (line.indexOf(this.#arduMAC) > 0) {
               arduIP = line.substring(line.indexOf("(") + 1, line.indexOf(")"));
            }
         });
      } catch (error) {
         console.log(error.message);
      }

      return arduIP;
   }
}