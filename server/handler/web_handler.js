const fs = require('fs');
const http = require('http');

const web_folder = "../webapp";

module.exports = {

   /**
    * Function for calling the Server from Browser
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   webHandler: (req, res) => {
      var url = req.url;
      if (url == "/") {
         url += "index.html";
      } else if (url.indexOf(".") == -1) {
         url += "/index.html";
      }

      console.log(url);

      var ending = `${url}`.split(".");

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

      fs.readFile((`${web_folder}${url}`), (err, data) => {
         if (err) {
            console.error(`E: 404: ${web_folder}${url}` );
            console.error(`E: ${err}` );
            res.statusCode = 404;
            res.end();
         } else {
            res.end(data);
         }
      });
   }
}