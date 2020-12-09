const http = require('http')
const path = require('path')

const web_handler = require('./handler/web_handler')
const app_handler = require('./handler/app_handler')
const station_handler = require('./handler/station_handler')

const port = 1920
const __rootname = __dirname

// const mysql = require('mysql')

const server = http
   .createServer((req, res) => {
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
   }).listen(port, () => {
      console.log(`Server listening at port ${port}`)
   })