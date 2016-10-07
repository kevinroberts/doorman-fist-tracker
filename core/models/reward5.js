var utils = require('../utils');

function Reward5(slackAPI, fireUser, channel, customText) {
    // always initialize all instance properties
    this.slackAPI = slackAPI;
    this.fireUser = fireUser;
    this.channel = channel;
    this.customText = customText;
}


Reward5.prototype.run = function() {

    var userLink = utils.getLinkFromUserId(this.fireUser.id);

    var rewardMessage = ':fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:\n' + userLink +
        ' is an AMAZING person! You should pay more attention to him/her.  :dancer: ';

    if (this.customText != '') {
        rewardMessage += '\n' + "Also " + userLink + " wanted y'all to know this... " + this.customText;
    }

    rewardMessage += '\n:fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5::fist::skin-tone-5:';

    utils.postMessage(this.slackAPI, this.channel, rewardMessage);

};


module.exports = Reward5;
