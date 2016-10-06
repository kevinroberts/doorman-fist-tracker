var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', stormpath.getUser, function(req, res, next) {
    var returnedData = {};
    returnedData.title = 'Doorman Mike - Fist Leaderboard';

    if (req.user) {
        returnedData.user = req.user;

        res.render('index', returnedData);
    } else {
        res.render('index', returnedData);
    }


});

module.exports = router;
