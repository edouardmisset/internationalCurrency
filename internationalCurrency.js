import dotenv from 'dotenv'
import axios from 'axios'

const ip = req.header('x-forwarded-for') || req.connection.remoteAddress

dotenv.config()

const IP_STACK_BASE_URL = process.env.IP_STACK_BASE_URL

const IP_STACK_API_KEY = process.env.IP_STACK_API_KEY

const queryOriginFinder = async IP =>
  (await axios.get(`${IP_STACK_BASE_URL}/${IP}?access_key=${IP_STACK_API_KEY}`))
    .data

const getlanguageAndCountryCode = ipDescriptor =>
  `${ipDescriptor.location.languages[0].code}-${ipDescriptor.country_code}`

const formatPrice = ({
  amount,
  currency,
  quantity,
  localization = 'en-US',
}) => {
  const numberFormat = new Intl.NumberFormat(localization, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  amount = zeroDecimalCurrency ? amount : amount / 100
  const total = (quantity * amount).toFixed(2)
  return numberFormat.format(total)
}

console.log(
  formatPrice({
    amount: 100,
    currency: 'EUR',
    quantity: 1,
    localization: 'fr-FR',
  })
) // $1.00

console.log(getlanguageAndCountryCode(await queryOriginFinder('84.102.179.10')))
