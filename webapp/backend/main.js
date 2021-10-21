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

      console.log("query:", query['f']);

      switch (query['f']) {
         case "get_ardu_availability":
            daten.getArduinoAvailability(res)
            break
         // case "arduip":
         //    daten.setArduIp(query['ip']);
         //    break;
         case "get_occupied":
            daten.getBelegteBoxen(res)
            break
         case "open":
            daten.open(res, query["id"])
            break
         case "get_box":
            daten.getBox(res, query['id']);
            break;
         case "delete":
            daten.boxFreigeben(res, query["id"]);
            break;
         case "get_av_sizes":
            daten.getVerfuegbare(res);
            break;
         case "request_and_open":
            daten.requestAndOpen(res, query["size"])
            break;
         case "update":
            var payload = "";

            req.on("data", chunk => {
               payload += chunk;
            })

            req.on("end", () => {
               daten.update(res, JSON.parse(payload));
            })

            break;
         default:
            res.end();
            break;
      }
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