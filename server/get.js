const http = require('http')

const options = {
   hostname: 'localhost',
   port: 1920,
   path: '/test/test/test',
   headers: {
      'user-agent': 'pickup-station'
   }
}

const req = http.get(options, (res) => {
   console.log(`statusCode: ${res.statusCode}`)
   console.log(res.headers)

   res.on('data', (d) => {
      process.stdout.write(d);
   })
})

req.on('error', error => {
   console.error("E: " + error);
})

req.end();