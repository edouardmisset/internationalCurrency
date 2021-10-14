const express = require('express')
const cors = require('cors')

// const { PORT, CORS_ALLOWED_ORIGINS } = require('./env')

require('dotenv').config()

const port = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.set('x-powered-by', false) // for security
app.set('trust proxy', true) // trust proxy

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',')

const corsOptions = {
  origin: (origin, callback) => {
    if (origin === undefined || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})

app.get('/', (req, res) => {
  const ip = req.ip
  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log(ip)
  res.send(
    `<body>
      <h1>IP Robot</h1>
      <p>Your IP address is: ${ip}</p>
    </body>`
  )
})

// process setup : improves error reporting
process.on('unhandledRejection', error => {
  console.error('unhandledRejection', JSON.stringify(error), error.stack)
})
process.on('uncaughtException', error => {
  console.error('uncaughtException', JSON.stringify(error), error.stack)
})

module.exports = server
