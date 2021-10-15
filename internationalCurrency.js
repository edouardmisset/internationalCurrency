const axios = require('axios')
require('dotenv').config()

// const ip = req.header('x-forwarded-for') || req.connection.remoteAddress

const IP_STACK_BASE_URL = process.env.IP_STACK_BASE_URL
const IP_STACK_API_KEY = process.env.IP_STACK_API_KEY

const requestOriginData = async IP => {
  try {
    const ipDescriptor = (
      await axios.get(
        `${IP_STACK_BASE_URL}${IP}?access_key=${IP_STACK_API_KEY}&output=json&fields=country_code,location.languages`
      )
    ).data
    return ipDescriptor
  } catch (err) {
    console.error(err)
    return err.message
  }
}

const formatPrice = ({
  amount,
  currency,
  quantity,
  localization = 'en-US',
}) => {
  const numberFormat = new Intl.NumberFormat(localization, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
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

module.exports = {
  formatPrice,
  requestOriginData,
}
