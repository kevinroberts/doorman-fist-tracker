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
    utils.getSlackUsers(this.slackAPI, function (slackUsers) {
        if (slackUsers != null) {
            _.forEach(slackUsers, function (user) {
                if (user.id != _this.fireUser.id) {
                    var userLink = utils.getLinkFromUserId(_this.fireUser.id);

                    var rewardMessage = ':fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:\n' + userLink +
                        ' is an AMAZING person! You should pay more attention to him/her.  :dancer: ';

                    if (_this.customText != '') {
                        rewardMessage += '\n' + "Also " + userLink + " wanted you to know this... " + _this.customText;
                    }

                    rewardMessage += '\n:fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:';

                    utils.postMessage(_this.slackAPI, user.id, rewardMessage);

                }
            });
        }
    });


    var selfMessage = ':fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:\n' +
        'Congrats on your big reward bro!! I just messaged all your friends about it!';

    selfMessage += '\n:fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:';

    utils.postMessage(this.slackAPI, this.fireUser.id, selfMessage);

};


module.exports = Reward25;
