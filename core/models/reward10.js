var _ = require('lodash');

function Reward10(slackAPI, fireUser, channel) {
    // always initialize all instance properties
    this.slackAPI = slackAPI;
    this.fireUser = fireUser;
    this.channel = channel;
    this.flowers = [
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers1.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers2.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers3.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers4.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers5.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers6.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers7.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers8.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers9.jpg?alt=media',
        'https://firebasestorage.googleapis.com/v0/b/' + process.env.FIREBASESTORAGE + '/o/flowers%2Fflowers10.jpg?alt=media'
    ]
}


Reward10.prototype.run = function() {

    var attachments = [
        {   "color" : '#36a64f',
            "title": "Your Bouquet:",
            "fallback" : "Your gift of flowers for the day",
            "image_url" :  _.sample(this.flowers)
        }
    ];

    // Attachments must be sent as a string see:
    // https://github.com/clonn/slack-node-sdk/issues/12

    var attachmentString = JSON.stringify(attachments);

    var payload;
    payload = {
        channel: this.fireUser.id,
        as_user : true,
        text: "Your daily gift of flowers has arrived.",
        attachments: attachmentString
    };


    this.slackAPI.api('chat.postMessage', payload, function (err, res) {
        console.log(res);
    });

};


module.exports = Reward10;
