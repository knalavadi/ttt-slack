//starts a tictactoe game, checks for opponent before starting game
'use strict'

const _ = require('lodash');
const config = require('../config');
const game = require('../tictactoe');

const slack = require('../slackApiProcess');

const msgDefaults = {
  response_type: 'in_channel',
  username: 'ttt',
}

const handler = (globalTicTacToeObject, payload, res) => {

    var gameList = globalTicTacToeObject.gameList;

    var tokens = payload.text.split(" ");

    var slackchatText = '';

    if (payload.channel_id in gameList)
    {
        let currentGame = gameList[payload.channel_id];

        slackchatText =   'there is already has an active game' +
          ' between ' + currentGame.username1 + ' and ' + currentGame.username2 +. 'Continue playing (/ttt move row column) or quit (/ttt quit)'+
          '\n A channel can only have one game being played at a time.';
    }
    else if(tokens.length < 2)
    {
        slackchatText = 'hmm, looks like you forgot to include the username of your opponent, try again';
    }
    else
    {
        let opponent_raw = tokens[1];
        console.log(opponent_raw)
        let opponent_split = opponent_raw.split("@")
        let opponent = opponent_split[1]
        console.log(opponent)

        if(slack.checkForUser(payload, opponent, globalTicTacToeObject)) {

            gameList[payload.channel_id] = new game.game(payload.user_name, opponent);

            let currentGame = gameList[payload.channel_id];

            slackchatText = game.getCurrentStatus(currentGame);
        }
        else {
            slackchatText = 'hmm, looks like this channel does not include that user.';
        }
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

module.exports = { pattern: /start/ig, handler: handler }