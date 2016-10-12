/*
* This file should be added to the systems daily crontab
 */
require('dotenv').config({silent: false});
var Slack = require('slack-node');
var firebase = require("firebase");
var utils = require('./core/utils');
var _ = require('lodash');
var Reward10 = require('./core/models/reward10');
var async = require('async');


// initialize Firebase connection
var config = {
    apiKey: process.env.FIREBASEAPIKEY,
    authDomain: process.env.FIREBASEURI,
    databaseURL: process.env.FIREBASEDBURL,
    storageBucket: process.env.FIREBASESTORAGE,
    messagingSenderId: process.env.FIREBASEMSGID
};
firebase.initializeApp(config);

var slack = new Slack(process.env.TOKEN);

var usersRef = firebase.database().ref('users');


utils.getUsersFromFirebase(usersRef, function (users) {


    var usersProcessed = 0;

    async.each(users, function (fireUser, callback) {

        usersProcessed++;
        if (_.has(fireUser, 'flowersToGive')) {
            var numberOfFlowers = fireUser.flowersToGive;
            if (numberOfFlowers > 0) {

                fireUser.flowersToGive = numberOfFlowers - 1;
                var firebase_update = {};
                firebase_update[fireUser.id] = fireUser;

                usersRef.update(firebase_update, function (response) {
                    var reward10 = new Reward10(slack, fireUser, fireUser.id);
                    reward10.run(function (res) {
                        callback();
                    });
                });
            } else {
                callback();
            }
        } else {
            fireUser.flowersToGive = 0;
            var firebase_update = {};
            firebase_update[fireUser.id] = fireUser;

            usersRef.update(firebase_update, function (response) {
                callback();
            });
        }

    }, function done(err) {

        if (err) {
            console.log('A user failed to process');
            process.exit(1);
        } else {
            console.log('process has finished. processed: ' + usersProcessed + ' users');
            process.exit(1);
        }
    });

});
