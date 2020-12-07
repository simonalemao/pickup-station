const http = require('http')

const options = {
  hostname: 'localhost',
  port: 1920,
  path: '/x',
  method: 'GET',
  data: 'one'
}

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error("E: "+ error)
})

req.end()