const http = require('http');
const querystring = require('querystring');

const { Daten } = require('./modules/Daten.js');
const daten = new Daten();

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
            res.end(await daten.arduino());
            break;
         case "get_occupied":
            res.end(await daten.getBelegteBoxen());
            break;
         case "open":
            await daten.open(query["id"]);
            res.end()
            break;
         case "get_box":
            res.end(await daten.getBox(query["id"]));
            break;
         case "delete":
            await daten.boxFreigeben(query["id"]);
            res.end();
            break;
         case "get_av_sizes":
            res.end(await daten.getVerfuegbare());
            break;
         case "request_and_open":
            var box = await daten.getBoxMitGroesse(query["size"]);
            await daten.open(box.id);
            res.end(JSON.stringify(box));
         case "update":
            var payload = "";

            req.on("data", chunk => {
               payload += chunk;
            })

            req.on("end", () => {
               daten.update(payload);
               res.end();
            })

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