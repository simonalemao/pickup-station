const http = require('http')

const server = http.createServer(handleRequest).listen(1920, () => {
   console.log(`Server listening at port ${port}`)
})

function handleRequest(req, res) {
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
}