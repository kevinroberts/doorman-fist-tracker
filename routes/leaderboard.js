var express = require('express');
var router = express.Router();

/* GET leaderboard page. */
router.get('/', function(req, res, next) {
    res.render('leaderboard', { title: 'Doorman Mike - Leaderboard' });
});

module.exports = router;
