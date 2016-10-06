
'use strict'

const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const commands = require('./slashCmds');
const helpCommand = require('./slashCmds/help');
const slackapi = require('./tictactoe');


let app = express();

//checks slack authorization token
slackapi.checkSlackAPI();


var globalTicTacToeObject = {};
globalTicTacToeObject.gameList = {};

if (config('PROXY_URI')) {
  app.use(proxy(config('PROXY_URI'), {
    forwardPath: (req, res) => { return require('url').parse(req.url).path }
  }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n Connected to tictactoe \n') })

app.post('/commands/ttt', (req, res) => {
  let payload = req.body

  if (!payload || payload.token !== config('TICTACTOE_COMMAND_TOKEN')) {
    let err = 'An invalid slash token was provided'
    console.log(err)
    res.status(401).end(err)
    return
  }

  // handler for slash commands 
  let cmd = _.reduce(commands, (a, cmd) => {
    return payload.text.match(cmd.pattern) ? cmd : a
  }, helpCommand)

  
  cmd.handler(globalTicTacToeObject, payload, res)
})

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n tictactoe LIVES on PORT ${config('PORT')}`)
})