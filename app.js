const express = require('express')
const cors = require('cors')
const { formatPrice, requestOriginData } = require('./internationalCurrency.js')

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

app.get('/', async (req, res) => {
  let ip = req.ip
  // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

  if (ip === '::1') {
    console.log('fake ip')
    ip = '84.102.179.10'
  }

  const originData = await requestOriginData(ip)

  const countryCode = originData?.country_code
  const languageCode = originData?.location.languages[0].code

  const price = formatPrice({
    amount: 100, // in cents (1/100 of a unit)
    currency: 'USD',
    quantity: 2,
    localization: `${languageCode}-${countryCode}`,
  })

  return res.send(
    `<body>
      <h1>IP Robot</h1>
      <p>Your IP address is: ${ip}</p>
      <p>Your language is: ${languageCode}-${countryCode}</p>
      <p>The price is: ${price}</p>
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
