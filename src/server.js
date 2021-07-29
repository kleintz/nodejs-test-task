const http = require('http')
const User = require('./models/user')
const UrlPattern = require('url-pattern')
const { parseBody, constructResponse } = require('./utils/routeUtils')
const { generatePDF } = require('./utils/pdfUtils')

const server = http.createServer((req, res) => {
  const { method, url } = req
  const userPattern = new UrlPattern('/users(/:id)')
  const userUrlMatch = userPattern.match(url)

  let body = []
  let userData
  req
    .on('error', (err) => {
      console.log(err)
    })
    .on('data', (chunk) => {
      body.push(chunk)
    })
    .on('end', async () => {
      body = Buffer.concat(body).toString()
      userData = parseBody(body)

      if (url === '/pdf' && method === 'POST') {
        const id = userData && userData.userId
        try {
          const user = await User.findById(id)
          if (user) {
            const pdf = await generatePDF(user.toObject({ getters: true }))
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename=user.pdf',
              'Content-Length': pdf.length
            })
            res.end(pdf)
          } else {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(constructResponse('User not found'))
          }
        } catch (e) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(constructResponse(e.message))
        }
      } else if (userUrlMatch && !userUrlMatch.id && method === 'POST') {
        try {
          const user = new User(userData)
          await user.save()
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(constructResponse(user))
        } catch (e) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(constructResponse(e.message))
        }
      } else if (userUrlMatch && method === 'GET') {
        try {
          const user = await User.findById(userUrlMatch.id)
          if (user) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(constructResponse(user))
          } else {
            res.statusCode = 404
            res.end()
          }
        } catch (e) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(constructResponse(e.message))
        }
      } else if (userUrlMatch && method === 'DELETE') {
        try {
          const user = await User.findByIdAndDelete(userUrlMatch.id)
          res.statusCode = 200
          res.end()
        } catch (e) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(constructResponse(e.message))
        }
      } else {
        res.statusCode = 404
        res.end()
      }
    })
})

module.exports = server
