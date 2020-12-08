const fs = require('fs');
const http = require('http')

module.exports = {

   /**
    * Function for calling the Server from Browser
    * 
    * @param {URL.pathname} req 
    * @param {http.ServerResponse} res 
    */
   webHandler: function (url, res) {
      if (url === "/") { url = "/index.html" }

      fs.readFile((`../webpage${url}`), (err, data) => {
         if (err) {
            res.statusCode = 404
            res.end()
         } else {
            res.end(data);
         }
      })
      // res.end("hallo browser!")
   }
}