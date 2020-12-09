const http = require('http');

module.exports = {

   /**
    * Function for calling the Server from Pickup-Station
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   stationHandler: (req, res) => {
      res.end('hallo pickup-station');
   }
}