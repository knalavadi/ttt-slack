//returns the status of the current game in the channel
'use strict'


const _ = require('lodash');
const config = require('../config');
const game = require('../tictactoe');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'ttt',
}

const handler = (globalTicTacToeObject, payload, res) => {

    var gameList = globalTicTacToeObject.gameList;

    var tokens = payload.text.split(" ");

    var slackchatText;

    if (payload.channel_id in gameList)
    {
        let currentGame = gameList[payload.channel_id];

        slackchatText = game.getCurrentStatus(currentGame);
    }
    else
    {
        slackchatText = 'Theres not an active game in this channel. go ahead and start one!';
    }

    var attachments = [
        {
            title: 'ttt',
            color: '#FFC300',
            text: slackchatText,
            mrkdwn_in: ['text']
        }
    ]

    let msg = _.defaults({
      channel: payload.channel_name,
      attachments: attachments
    }, msgDefaults)

    res.set('content-type', 'application/json')
    res.status(200).json(msg)
    return

}

module.exports = { pattern: /status/ig, handler: handler }