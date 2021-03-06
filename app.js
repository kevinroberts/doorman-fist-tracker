var express = require('express');
var hbs = require('express-hbs');
var path = require('path');
var _ = require('lodash');
require('dotenv').config({silent: true});
var Slack = require('slack-node');
stormpath = require('express-stormpath');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var firebase = require("firebase");

if (!process.env.FIREBASEURI) {
  console.log('Error: Specify Firebase configs in environment');
  process.exit(1);
}
if (!process.env.TOKEN) {
  console.log('Error: Specify Slack token in environment');
  process.exit(1);
}


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

var routes = require('./routes/index');
var rewards = require('./routes/rewards');
var leaderboard = require('./routes/leaderboard');
var about = require('./routes/about');

var app = express();

// set specific global logic for production mode content
app.locals.production = process.env.NODE_ENV === 'production';
app.locals.currentyear = new Date().getFullYear();
app.locals.firebase = firebase;
app.locals.slack = slack;


// view engine setup

hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);

  return {
    "+": lvalue + rvalue,
    "-": lvalue - rvalue,
    "*": lvalue * rvalue,
    "/": lvalue / rvalue,
    "%": lvalue % rvalue
  }[operator];
});

hbs.registerHelper('if_eq', function(a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.set('trust proxy',true);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(stormpath.init(app, {
  web: {
    login: {
      view: path.join(__dirname,'views','login.hbs')
    },
    register: {
      view: path.join(__dirname,'views','register.hbs')
    },
      logout: {
        enabled: true,
        uri: '/logout',
        nextUri: '/login?status=logout'
      }
  },
  expand: {
    customData: true
  },
  preRegistrationHandler: function (formData, req, res, next) {
    slack.api("users.list", function (err, res) {
      if (res.members) {
        var foundEmail = _.find(_.map(res.members, 'profile'), { 'email': formData.email});
        if (_.isUndefined(foundEmail)) {
          return next(new Error('Your email address was not found on our Slack system. Please use the same one you used for your Slack user.'));
        } else {
          next();
        }
      } else {
        console.log('error trying to retrieve users from slack', err);
        next();
      }
    });
  },
  postRegistrationHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just registered!');
    // add user to general group
    // account.addToGroup(groupurl, function(err, membership) {
    //   console.log(membership);
    // });

    // map users slack ID to custom data

    slack.api("users.list", function (err, res) {
      if (res.members) {
        var userIndex = _.findIndex(_.map(res.members, 'profile'), { 'email': account.email});
        var slackUser = res.members[userIndex];
        req.user.customData.slackID = slackUser.id;
        if (_.has(slackUser, 'profile.image_192')) {
          req.user.customData.profileImage = slackUser.profile.image_192;
        }
        req.user.customData.save();
        next();

      } else {
        console.log('error trying to retrieve users from slack', err);
        next();
      }
    });

  }
}));


// define routes

app.use('/', routes);
app.use('/rewards', rewards);
app.use('/leaderboard', leaderboard);
app.use('/about', about);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
