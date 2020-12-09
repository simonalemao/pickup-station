const http = require('http');
const fs = require('fs');
const rootdir = require('../rootdir').rootdir;

module.exports = {

   /**
    * Function for calling the Server from App
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   appHandler: (req, res) => {
      var res;
      switch (req.method) {
         case 'GET':
            var resJSON;
            switch (req.url) {
               case "/testjson":
                  var resJSON = [
                     "Dies ist eine Testantwort vom Pickup-Station-Server",
                     "Millisekunden: " + (new Date).getTime().toString()
                  ];
                  var testdir = fs.mkdir(`${rootdir}/testdir`, (err) => {
                     if (err) {
                        console.log(err);
                     } else {
                        console.log("testdir erstellt?");
                     }
                  });
                  break;
               default:
                  break;
            }
            res.end(JSON.stringify(resJSON));
         case 'POST':
            req.on() ('data', (chunk) => {
               console.log(`Received ${chunk.length} bytes of data.`);
            })
            console.log(req.headers);
            console.log(req.method);
            res.end();
            break;
         default:
            break;
      }
   }
}