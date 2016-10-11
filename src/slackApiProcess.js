/**
 */
const slack = require('slack')
const config = require('./config')
// var cfg = require('../app.json');
var teamUsersList = {};


// ========= Authentication=========
function checkSlackApi(){
    if (config('SLACK_API_TOKEN')){
        slack.auth.test({ token: config('SLACK_API_TOKEN')}, function(err,data){
            if (err != null){
            }
            else {
                getTeamUserList();
            }
        });
    }
    
}


//get the team user list filling the teamUsersListVariable asynchronously, following slack's API methods;
function getTeamUserList(){

    slack.users.list({
        token: config('SLACK_API_TOKEN')
    }, function (err, data) {
        // iterate over memember list 
        for(var person = 0; person < data.members.length; person++){
            // sets the key as member name, value as id 
            teamUsersList[data.members[person].name] = data.members[person].id;
        }
    });
}

function checkForUser(payload, opponent){

    var userFound = true;

    if (teamUsersList != null) {
        if (teamUsersList[opponent] != null) {
            

                slack.channels.info({
                    token: config('SLACK_API_TOKEN'),
                    channel: payload.channel_id
                }, function (err, data) {
                    if (slack.channel != undefined){
                        var indexVal = data.channel.members.indexOf(teamUsersList[opponent]);

                        if(indexVal >= 0){
                            userFound = true;
                        }
                        else{
                            userFound = false;
                        }
                    }
                });

        }
        else {
            userFound = false;
        }
    }
    else {
        userFound = true;
    }

    return userFound;



// ===========direct channel =========
    var userFound = true;

    if (teamUsersList != null) {
        if (teamUsersList[opponent] != null) {


                slack.groups.info({
                    token: config('SLACK_API_TOKEN'),
                    channel: payload.group_id
                }, function (err, data) {
                    if (slack.groups != undefined){
                        console.log("made it here")
                        var indexVal = data.group.members.indexOf(teamUsersList[opponent]);

                        if(indexVal >= 0){
                            userFound = true;
                        }
                        else{
                            userFound = false;
                        }
                    }
                });

        }
        else {
            userFound = false;
        }
    }
    else {
        userFound = true;
    }

    return userFound;

}

module.exports.slack = slack;
module.exports.checkSlackApi = checkSlackApi;
module.exports.checkForUser = checkForUser;
module.exports.getTeamUserList = getTeamUserList;