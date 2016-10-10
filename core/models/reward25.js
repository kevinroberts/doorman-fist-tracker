var _ = require('lodash');
var utils = require('../utils');

function Reward25(slackAPI, fireUser, customText) {
    // always initialize all instance properties
    this.slackAPI = slackAPI;
    this.fireUser = fireUser;
    this.customText = customText;
}


Reward25.prototype.run = function() {
    var _this = this;

    var userLink = utils.getLinkFromUserId(_this.fireUser.id);

    var rewardMessage = ':fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:\n' + userLink +
        ' is an AMAZING person! You should pay more attention to him/her.  :dancer: ';

    if (_this.customText != '') {
        rewardMessage += '\n' + "Also " + userLink + " wanted you to know this... " + _this.customText;
    }

    rewardMessage += '\n:fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:';

    utils.getSlackUsers(this.slackAPI, function (slackUsers) {
        if (slackUsers != null) {
            _.forEach(slackUsers, function (user) {
                if (user.id != _this.fireUser.id && !user.is_bot) {

                    utils.postMessage(_this.slackAPI, user.id, rewardMessage);

                }
            });
        }
    });


    var selfMessage = 'Congrats on redeeming your 25 fist reward bro!! I just messaged all your friends your message.';
    selfMessage += '\n\n — Love :doorman: Mike';

    var attachments = [
        {   "color" : 'warning',
            "title": "Your Message:",
            "fallback" : "reward message text",
            "text" : rewardMessage
        }
    ];

    var attachmentString = JSON.stringify(attachments);
    var payload = {
        channel: this.fireUser.id,
        as_user : true,
        text: selfMessage,
        attachments: attachmentString
    };

    this.slackAPI.api('chat.postMessage', payload, function (err, res) {
        console.log(res);
    });


};


module.exports = Reward25;
