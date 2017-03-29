require('dotenv').config();

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const http = require('http');
const path = require('path');
const express = require('express');
const s = require('./expressAppInstance.js');
const session = require('express-session')
const webpack = require('webpack');
const webpackMiddleware = require('webpack-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Models = require('./server/Models.js');
const config = require('./webpackconfig.js');
const routes = require('./server/routes.js');


const User = Models.User;
const Reviewer = Models.Reviewer;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const email = profile.emails.find(function(e) { return e.type === "account"; }).value;
    const name = profile.displayName;

    User.find({
      where: {
        email: email,
      }
    }).then(function(user) {
      if (user) {
        return cb(null, user.dataValues);
      } else {
        //create user
        User.create({
          email: email,
          admin: false,
          reviewer: true,
          name: name,
        }).then(function(user) {
          if (user) {
            return cb(null, user.dataValues);
          }
          else {
            console.error("there was an error while creating user", user);
          }
        });
      }
    });

  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.find({
    where: {
      id: id,
    },
  }).then(function(user) {
    if (user) {
      cb(null, user.dataValues);
    }
    else {
      throw new Error("This user is not in this session");
    }
  });
});

const compiler = webpack(config);
s.app.use(webpackMiddleware(compiler));
s.app.use(cookieParser());
s.app.use(bodyParser.urlencoded({
    extended: true
}));

s.app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
}));

s.app.use(passport.initialize());

s.app.use(passport.session());

s.app.get("/", function(req, res) {
  if (!req.user) {
    res.redirect('/login');
  }
  else {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  }
});

s.app.use("/routes", routes);

s.app.use(express.static('dist'));

s.app.get(
  process.env.GOOGLE_AUTH_ROUTE,
  passport.authenticate(
    'google',
    {
      scope: ['profile', 'email']
    }
  )
);

s.app.get(
  process.env.GOOGLE_AUTH_CALLBACK,
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

s.app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

s.app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/login.html'));
});

const app_port = process.env.PORT || 3000;
s.server.listen(app_port, function() {
  console.log('listening to port ' + app_port);
});
