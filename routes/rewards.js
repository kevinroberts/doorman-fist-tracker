var express = require('express');
var _ = require('lodash');
var router = express.Router();
var utils = require('../core/utils');
var Reward = require('../core/models/reward');
var Reward5 = require('../core/models/reward5');
var Reward10 = require('../core/models/reward10');
var Reward25 = require('../core/models/reward25');


/* GET rewards page. */
router.get('/', stormpath.loginRequired, function(req, res, next) {

    var usersRef = req.app.locals.firebase.database().ref('users');

    var returnedData = {};
    returnedData.title = 'Doorman Mike - Rewards';

    if (req.query) {
        if (_.has(req.query, 'status')) {
            returnedData.status = req.query.status;
        }
    }

    var baseRewards = [];

    var reward1 = new Reward(25, "Mike will PM everyone on Slack saying how awesome you are.", "green", "");
    var reward2 = new Reward(10, "Mike will give you virtual flowers everyday for a week.", "orange", "");
    var reward3 = new Reward(5, "A Personal Mike shoutout saying how awesome you are.", "red", "");

    utils.getUsersFromFirebase(usersRef, function (users) {
        var fireUser = _.find(_.map(users), { 'id': req.user.customData.slackID});

        if (_.has(fireUser, 'fists')) {
            var fists = fireUser.fists;
            reward1.currentFists = fists;
            reward2.currentFists = fists;
            reward3.currentFists = fists;
        }

        baseRewards.push(reward1);
        baseRewards.push(reward2);
        baseRewards.push(reward3);

        returnedData.rewards = baseRewards;

        res.render('rewards',  returnedData );

    });


});

// Handle rewards post processing
router.post('/', stormpath.loginRequired, function (req, res) {
    if (_.has(req.body, 'rewardId') && _.has(req.body, 'fistsNeeded')) {

        var usersRef = req.app.locals.firebase.database().ref('users');
        var fistsNeeded = _.parseInt(req.body.fistsNeeded);
        var rewardId = req.body.rewardId;
        if (rewardId == 'reward5' && fistsNeeded != 5) {
            res.redirect('/rewards?status=failedRedeem');
        }
        if (rewardId == 'reward10' && fistsNeeded != 10) {
            res.redirect('/rewards?status=failedRedeem');
        }
        if (rewardId == 'reward25' && fistsNeeded != 25) {
            res.redirect('/rewards?status=failedRedeem');
        }

        utils.getUsersFromFirebase(usersRef, function (users) {
            var fireUser = _.find(_.map(users), { 'id': req.user.customData.slackID});

            if (_.has(fireUser, 'fists')) {
                var fists = fireUser.fists;
                if (fists >= fistsNeeded) {
                    // user has the fists!
                    // subtract the needed number
                    fireUser.fists = fists - fistsNeeded;
                    var firebase_update = {};
                    firebase_update[fireUser.id] = fireUser;

                    usersRef.update(firebase_update, function (response) {
                        var channel = 'general';
                        var customText = '';
                        if (!req.app.locals.production) {
                            channel = 'private-testing';
                        }
                        if (_.has(req.body, 'customText')) {
                            customText = req.body.customText;
                        }

                        if (rewardId == 'reward5') {
                            var reward5 = new Reward5(req.app.locals.slack, fireUser, channel, customText);
                            reward5.run();
                        }
                        if (rewardId == 'reward10') {
                            var reward10 = new Reward10(req.app.locals.slack, fireUser, fireUser.id);
                            reward10.run();
                        }
                        if (rewardId == 'reward25') {
                            var reward25 = new Reward25(req.app.locals.slack, fireUser, customText);
                            reward25.run();
                        }

                        res.redirect('/rewards?status=redeemed');
                    });

                } else {
                    res.redirect('/rewards?status=failedRedeem');
                }
            } else {
                res.redirect('/rewards?status=failedRedeem');
            }
        });


    } else {
        res.redirect('/rewards?status=failedRedeem');
    }

});

module.exports = router;
