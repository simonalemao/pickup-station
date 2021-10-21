const { request, end } = require('http');
const { execSync } = require('child_process');

export class Arduino {
   #arduMAC = '8c:aa:b5:89:c6:c0';
   #arpCommand = 'arp -a';
   #arduIP;

   constructor() {
   }

   async getStatus() {
      return new Promise(res => res(JSON.stringify([(Math.random() * 2.5) > 1 ? 1 : 0])));
   }

   open(id) {
      return new Promise(res => res(id));
   }

   arduIpErneuern() {
   }

   setIp(ip) { }

   freigeben(id) {
      return new Promise(res => { res(id) });
   }

   getAvailability(Response) {
      Response.end("true")
   }

   // async getAvailability() {
   //    return true
   // }

   #getPromise(pathOhneSlash) {
      if (this.#arduIP == null) {
         throw "arduIP == null";
      } else {
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
               result("");

               // throw "timeout";
            });

            req.on("error", (err) => {
               req.destroy();
               result("");

               // throw "other error";
            });

            req.end();
         });
      }
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