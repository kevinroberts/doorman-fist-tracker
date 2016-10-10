var _ = require('lodash');

module.exports = {

    getUsersFromFirebase: function (usersRef, callback) {
        usersRef.once('value', function (snap) {
            callback(snap.val());
        }, function (err) {
            // code to handle read error
            console.log('error trying to retrieve users from fb', err);
            callback(null);
        });
    },

    getSlackUsers: function (slackApi, callback) {
        slackApi.api("users.list", function (err, res) {
            if (_.has(res, 'members')) {
                callback(res.members);
            } else {
                console.log('error trying to retrieve users from slack', err);
                callback(null);
            }
        });
    },
    postMessage: function (slackApi, channel, message) {

        // if you are posting to more than one channel at once
        if (channel instanceof Array) {

            for (var i = 0, len = channel.length; i < len; i++) {
                var curChannel = channel[i];
                slackApi.api('chat.postMessage', {'channel' : curChannel, 'text' : message, 'as_user' : true}, function (err, res) {
                    console.log(res);
                });
            }
        } else {
            // post to a single channel
            slackApi.api('chat.postMessage', {'channel' : channel, 'text' : message, 'as_user' : true}, function (err, res) {
                console.log(res);
            });
        }
    },
    getLinkFromUserId: function (userId) {
        return "<@" + userId + ">";
    }

};