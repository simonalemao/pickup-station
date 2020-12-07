const http = require('http')

const port = 1920

const server = http.createServer((req, res) => {
   let data = '';

   req.on('data', (chunk) => {
      console.log(`Data chunk: ${chunk}`);
      data += chunk;
   });
   req.on('end', () => {
   });


   //   res.statusCode = 200
   //   res.setHeader('Content-Type', 'text/html')
   //   res.end('<h1>Hello, World!</h1>')
})

server.listen(port, () => {
   console.log(`Server running at port ${port}, (internally)`)
})