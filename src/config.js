 // @author Matt Creager- @mattcreager
// credit: https://github.com/mattcreager/starbot/blob/master/src/config.js
'use strict'

const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  PROXY_URI: process.env.PROXY_URI,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  TICTACTOE_COMMAND_TOKEN: process.env.TICTACTOE_COMMAND_TOKEN,
  SLACK_API_TOKEN: process.env.SLACK_API_TOKEN,
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
