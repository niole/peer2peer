"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;

module.exports = router;
