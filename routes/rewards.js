var express = require('express');
var router = express.Router();

/* GET rewards page. */
router.get('/', function(req, res, next) {
    res.render('rewards', { title: 'Doorman Mike - Rewards' });
});

module.exports = router;
