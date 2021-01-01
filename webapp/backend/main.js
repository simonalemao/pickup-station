const http = require('http');
const querystring = require('querystring');

const daten = new (require('./modules/Daten.js').Daten)('daten.json');
const arduino = new (require('./modules/Arduino.js').Arduino)();

/**
 * 
 * @param {http.IncomingMessage} req Request
 * @param {http.ServerResponse} res Response
 */
export default async function (req, res) {
   'use strict';

   var query;

   if (req.url.indexOf('?') < 0) {
      // Keine gültige URL für Backend, weil keine query
      redirectToHomepage(res);

   } else if (Object.keys
      ((query = querystring.parse(req.url.substr(req.url.indexOf('?') + 1))))
      .length < 1) {
      // Query enthält kein Element
      redirectToHomepage(res);

   } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      // Query verarbeiten
      switch (query['f']) {
         case "getbelegte":
            res.end(daten.getBelegteBoxen());
            break;
         case "open_or_is_closed":
            arduino.getStatus().then(mes => {
               console.log(mes.substr(0, 100))
               res.end(mes.substr(0, 100));
            }).catch(err => {
               console.log(err);
               res.end(JSON.stringify(err));
            });
            // arduino.open(query['id']);
            break;
         default:
            console.log(query['f']);
            res.end();
            break;
      }


      // var arduIp = getArduIp();
      // console.log(`Arduino IP: ${arduIp == null ? "unbekannt" : arduIp}`);
   }
}

function redirectToHomepage(res) {
   // res.statusCode = 307;
   // res.setHeader("Location", "https://pickup-station.stec.fh-wedel.de/");
   res.end();
}