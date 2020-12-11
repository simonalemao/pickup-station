process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const https = require('https');

https.get('https://pickup-station.stec.fh-wedel.de/', {
   rejectUnauthorized: "false"
}, (res) => {
   console.log('statusCode:', res.statusCode);
   console.log('headers:', res.headers);

   res.on('data', (d) => {
      process.stdout.write(d);
   });

}).on('error', (e) => {
   console.error("E: ", e);
});

// const http = require('http')

// const options = {
//    hostname: 'pickup-station.stec.fh-wedel.de',
//    port: 443,
//    // path: 'index.html',
//    headers: {
//       'x-user': 'pickup-station'
//    }
// }

// const req = http.get(options, (res) => {
//    console.log(`statusCode: ${res.statusCode}`)
//    console.log(res.headers)

//    res.on('data', (d) => {
//       process.stdout.write(d);
//    })
// })

// req.on('error', error => {
//    console.error("E: " + error);
// })

// req.end();