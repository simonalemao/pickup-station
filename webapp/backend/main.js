const http = require('http');
const querystring = require('querystring');

const daten = new (require('./modules/Daten.js').Daten)();

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

   } else if (Object.keys((query = getQueryPairs(req.url))).length < 1) {
      // Query enthält kein Element
      redirectToHomepage(res);

   } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      switch (query['f']) {
         case "arduino":
            var x = await daten.arduino();
            console.log("ardu:\n" + x);
            res.end(x);
            break;
         case "get_occupied":
            res.end(daten.getBelegteBoxen());
            break;
         case "open":
            await daten.open(query["id"]);
            res.end()
         case "get_box":
            res.end(await daten.getBox(query["id"]));
         case "delete":
         case "get_av_sizes":
         case "request_and_open":
         case "update":
            console.log(query);
            res.end();
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
   res.statusCode = 307;
   res.setHeader("Location", "https://pickup-station.stec.fh-wedel.de/");
   res.end();
}

function getQueryPairs(url) {
   return querystring.parse(url.substr(url.indexOf('?') + 1));
}