const http = require('http');

module.exports = {

   /**
    * Function for calling the Server from App
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   appHandler: function (req, res) {
      var resJSON = {
         "any": "thing",
         "time": (new Date).getTime().toString()
      }

      res.end(JSON.stringify(resJSON));
   }
}