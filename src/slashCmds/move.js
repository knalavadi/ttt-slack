//move js for player's moves

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

    var tokens = payload.text.split(" "); //userinput [row] [col]

    var slackchatText = '';

    if (payload.channel_id in gameList)
    {
        if(tokens.length < 3){
            slackchatText = 'hmm, that doesnt look valid, enter a row and column in the format /ttt move [row] [col]';
        }
        else
        {
            let currentGame = gameList[payload.channel_id];

            let row = parseInt(tokens[1]);
            let column = parseInt(tokens[2]);

            slackchatText = game.move(payload, currentGame, row, column);

            if(currentGame.finished){
                delete gameList[payload.channel_id];
            }
        }
    }
    else
    {
        slackchatText = 'theres no longer an active game in this channel, start a new one!';
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

module.exports = { pattern: /move/ig, handler: handler }