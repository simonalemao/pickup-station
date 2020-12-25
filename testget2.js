const http = require('http')

const options = {
   hostname: '172.30.0.252',
   port: 80,
   // path: 'index.html',
   // headers: {
   //    'x-user': 'pickup-station'
   // }
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