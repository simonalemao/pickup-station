const http = require('http')

const port = 1920

const server = http.createServer((req, res) => {
   let data = '';

   console.log(req.headers);

   req.on('data', (chunk) => {
      console.log(`Data chunk: ${chunk}`);
      data += chunk;
      console.log(data);
   })

   req.on('end', () => {
   })

   res.setHeader('Content-Type', 'text/html')
   res.setHeader('X-test-header', 'works')
   res.end('<h2>Hello, World</h2>')
})

server.listen(port, () => {
   console.log(`Server running at port ${port}`)
})
