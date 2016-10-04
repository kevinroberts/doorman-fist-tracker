var _ = require('lodash');
var express = require('express');
var router = express.Router();

/* GET leaderboard page. */
router.get('/', function(req, res, next) {
    var usersRef = req.app.locals.firebase.database().ref('users');

    var returnedData = {};
    returnedData.title = 'Doorman Mike - Leaderboard';

    getSlackUsers(req.app.locals.slack, function (slackUsers) {
       if (slackUsers != null) {
           getUsersForLeaderboard(usersRef, function (users) {
               var userData = [];
               if (users != null) {
                   _.forEach(users, function (user) {
                       var userObj = {};
                       userObj.id = user.id;
                       var slackUserObj = _.find(slackUsers, {'id' : user.id });

                       if (_.has(user, 'name')) {
                           userObj.aka = user.name;
                       }
                       if (_.has(slackUserObj, 'name')) {
                           userObj.name = '@' + slackUserObj.name;
                       } else {
                           userObj.name = '@' + user.id;
                       }
                       if (_.has(slackUserObj, 'profile')) {
                           var profile = slackUserObj.profile;
                           if (_.has(profile, 'image_192')) {
                               userObj.image = slackUserObj.profile.image_192;
                           } else {
                               userObj.image = "http://placekitten.com/200/200";
                           }
                       }
                       if (_.has(user, 'fists')) {
                           userObj.fists = user.fists;
                       } else {
                           userObj.fists = 0;
                       }

                       userData.push(userObj);
                   });
                   userData = _.orderBy(userData, ['fists'], ['desc']);
                   returnedData.users = userData;

                   res.render('leaderboard', returnedData);

               } else {
                   res.render('leaderboard', returnedData);
               }
           });

       } else {
           res.render('leaderboard', returnedData);
       }
    });

});

function getUsersForLeaderboard(usersRef, callback) {
    usersRef.once('value', function (snap) {
        callback(snap.val());
    }, function (err) {
        // code to handle read error
        console.log('error trying to retrieve users from fb', err);
        callback(null);
    });

}

function getSlackUsers (slackApi, callback) {
    slackApi.api("users.list", function (err, res) {
        if (res.members) {
            callback(res.members);
        } else {
            console.log('error trying to retrieve users from slack', err);
            callback(null);
        }
    });
}

module.exports = router;
