const http = require('http');

module.exports = {

   /**
    * Function for calling the Server from Pickup-Station
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   appHandler: function (req, res) {
      res.end('hallo pickup-station');
   }
}