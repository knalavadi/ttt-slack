//help slash command

'use strict'

const _ = require('lodash')
const config = require('../config')

const msgDefaults = {
  response_type: 'in_channel',
  username: 'tictactoe',
}

let attachments = [
  {
    title: 'TicTacToe Slack Instructions',
    text: '`/ttt start [username]` choose username as your tic tac toe opponent' +
        '\n`/ttt status` returns current board status and whose turn it is' +
        '\n`/ttt move [row] [column]` mark an empty space row (1,2 or 3) and column (1,2 or 3) of the board' +
        '\n`/ttt quit` quits the current game in the channel' +
        '\n`/ttt help`',
    mrkdwn_in: ['text']
  }
]

// defines handler function to be used in other scripts
const handler = (globalTicTacToeObject, payload, res) => {
  let msg = _.defaults({
    channel: payload.channel_name,
    attachments: attachments
  }, msgDefaults)

  res.set('content-type', 'application/json')
  res.status(200).json(msg)
  return
}

module.exports = { pattern: /help/ig, handler: handler }