const fs = require('fs');
const http = require('http');

module.exports = {

   /**
    * Function for calling the Server from Browser
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   webHandler: function (req, res) {
      var url = req.url;
      switch (url) {
         case "/":
            url += "index.html";
            break;
         default:
            break;
      }

      var ending = `${url}`.split(".");

      if (ending.length = 2) {
         switch (ending[1]) {
            case "html":
               res.setHeader("Content-Type", "text/html");
               break;
            case "js":
               res.setHeader("Content-Type", "application/javascript");
               break;
            default:
               break;
         }
      }

      fs.readFile((`../webpage${url}`), (err, data) => {
         if (err) {
            res.statusCode = 404;
            res.end();
         } else {
            res.end(data);
         }
      })
   }
}