module.exports = {

   /**
    * Function for calling the Server from Browser
    * 
    * @param {http.IncomingMessage} req 
    * @param {http.ServerResponse} res 
    */
   webHandler: function(req, res) {
      res.end("hallo browser!")
   }
}