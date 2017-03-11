"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;

router.get('/peers/all/:userId', function(req, res) {
  User.findAll().then(function(users) {
    res.send(users.map(function(u) { return u.dataValues; }));
  });
});

module.exports = router;
