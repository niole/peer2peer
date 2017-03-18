"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Reviewer = models.Reviewer;
const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;

router.get('/peers/all/:userId', function(req, res) {
  User.findAll().then(function(users) {
    res.send(users.map(function(u) { return u.dataValues; }));
  });
});

router.post('/reviewsession/create/', function (req, res) {
  const body = req.body;
  console.log('body', body);
  const reviewers = body.reviewers;
  const deadline = body.deadline;
  const creatorId = body.userId;
  const questions = body.questions;

  /**
    create review session,
    create questions for review session
    create reviewers for session
   */

  ReviewSession.create({
    createdBy: creatorId,
    deadline,
  }).then(function(s) {
    const session = s.dataValues;
    const newQuestions = questions.map(function(q) {
      return {
        reviewSessionId: session.id,
        content: q.content,
      };
    });

    Question.bulkCreate(newQuestions).then(function() {
      const newReviewers = reviewers.map(function(r) {
        return {
          reviewSessionId: session.id,
          userId: r.id,
        };
      });

      Reviewer.bulkCreate(newReviewers).then(function() {
        res.send(true);
      });

    });

  });

});

module.exports = router;
