require('dotenv').config();

const http = require('http');
const path = require('path');
const express = require('express');
const s = require('./expressAppInstance.js');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Models = require('./server/Models.js');
const config = require('./webpackconfig.js');
const routes = require('./server/routes.js');


const FIXTURE_USERIDS_PATTERN = '^/[0-9]+$';
const User = Models.User;
const Reviewer = Models.Reviewer;
const compiler = webpack(config);

s.app.use(webpackMiddleware(compiler));
s.app.use(cookieParser());
s.app.use(bodyParser.urlencoded({
    extended: true
}));

s.app.use("/routes", routes);

s.app.use(express.static('dist'));

s.server.listen(3000, function() {
  console.log('listening to port 3000');
});

s.app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

s.app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/login.html'));
});

s.app.get('/:email/:name/:id', function response(req, res) {
  const id = req.params.id;
  const name = req.params.name;
  const email = req.params.email;

  //verify id
  var options = {
    host: 'googleapis.com',
    port: 80,
    path: '/oauth2/v3/tokeninfo?id_token=' + id,
  };

  http.get(options, function(resp) {
    resp.on('data', function(chunk) {
      //TODO this is 404ing

      User.find({
        where: {
          email: email,
        }
      }).then(function(user) {
        if (user) {
          res.redirect('/');
        } else {
          //create user
          User.create({
            email: email,
            admin: true,
            name: name,
          }).then(function(user) {
            if (user) {
              res.redirect('/');
            }
            else {
              console.error("there was an error while creating user", user);
            }
          });
        }
      });
    });

  }).on("error", function(e){
    console.log("Something's wrong with your id token.");
  });
});

s.app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});
