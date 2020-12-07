const http = require('http')
const web_handler = require('./handler/web_handler')
const port = 1920

// const mysql = require('mysql')

const server = http
   .createServer((req, res) => {
      console.log('Requesting: ')
      console.log(req.url)
      console.log("...\n");

      var userAgent = req.headers["user-agent"]

      console.log("User-Agent:")
      console.log(userAgent)

      switch (userAgent) {
         case 'pickup-station':
            res.end('hallo pickup-station')
            break;
         case 'app':
            res.end('hallo app')
            break;
         default:
            web_handler.webHandler(req, res)
            break;
      }
   }).listen(port, () => {
      console.log(`Server listening at port ${port}`)
   })

