
'use strict'

/*
quits the game whether you are in the game or not
 */

const _ = require('lodash');
const config = require('../config');
const game = require('../tictactoe');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'ttt',
}

const handler = (globalTicTacToeObject, payload, res) => {

    var gameList = globalTicTacToeObject.gameList;

    var slackchatText = '';

    if (payload.channel_id in gameList) {
        let currentGame = gameList[payload.channel_id];
        slackchatText = 'Quitting current game in this channel between ' + currentGame.username1 + ' and ' + currentGame.username2;

        delete gameList[payload.channel_id];
    }
    else {
        slackchatText = 'There isn\'t an active game to quit in this channel';
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

module.exports = { pattern: /quit/ig, handler: handler }