const { request } = require('http');
// const { execSync } = require('child_process');

export class Arduino {
   arduIP;

   constructor() { }

   getStatus() {
      return this.getPromise("s");
   }

   open(id) {
      return this.getPromise(`o${id}`);
   }

   setIp(ip) {
      this.arduIP = ip;
   }

   freigeben(id) {
      return this.getPromise(`f${id}`);
   }

   // getAvailability() {
   //    return this.getStatus()
   // }

   getAvailability(Response) {
      if (this.arduIP == null) {
         // console.error("no_ip")
         Response.end("false")
      } else
         try {
            this.getPromise("s")
               .then((data) => {
                  console.log(data)
                  Response.end("true")
               }).catch(() => {
                  Response.end("false")
               })
         } catch (error) {
            console.error(error);
            Response.end("false")
         }
   }

   getPromise(pathOhneSlash) {
      return new Promise((resolve, reject) => {
         var req = request({
            "hostname": this.arduIP,
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
               resolve(resultData);
            })
         });

         req.on("timeout", () => {
            req.destroy();
            reject("timeout");
         });

         req.on("error", (err) => {
            req.destroy();
            reject("other error");
         });

         req.end();
      });
   }

}