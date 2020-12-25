// const http = require('http')

const web_handler = require('./handler/web_handler');
const app_handler = require('./handler/app_handler');
const station_handler = require('./handler/station_handler');

import arp from '@network-utils/arp-lookup';

{
// const port = 1920
// const __rootname = __dirname

// const mysql = require('mysql')

// const server = http
//    .createServer((req, res) => {
//       console.log("neue anfrage")
//       res.setHeader("Access-Control-Allow-Origin", "*")
//       switch (req.headers["x-user"]) {
//          case 'pickup-station':
//             console.log("pickup");
//             station_handler.stationHandler(req, res);
//             break;
//          case 'app':
//             console.log("app");
//             app_handler.appHandler(req, res);
//             break;
//          default:
//             console.log('web');
//             web_handler.webHandler(req, res);
//             break;
//       }
//    }).listen(port, () => {
//       console.log(`Server listening at port ${port}`)
//    })
}

export default async function (req, res) {
   console.log("neue anfrage")
   console.log(req.url)
   console.log(await arp.getTable());
   res.setHeader("Access-Control-Allow-Origin", "*")
   switch (req.headers["x-user"]) {
      case 'pickup-station':
         console.log("pickup");
         station_handler.stationHandler(req, res);
         break;
      case 'app':
         console.log("app");
         app_handler.appHandler(req, res);
         break;
      default:
         console.log('web');
         web_handler.webHandler(req, res);
         break;
   }
} 