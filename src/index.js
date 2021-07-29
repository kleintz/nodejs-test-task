require('dotenv').config()
require('./db/mongoose')
const server = require('./server')
const hostname = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
