var express = require('express');
var router = express.Router();

/* GET rewards page. */
router.get('/', function(req, res, next) {
    res.render('about', { title: 'Doorman Mike - About' });
});

module.exports = router;
