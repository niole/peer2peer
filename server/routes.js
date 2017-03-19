"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Reviewer = models.Reviewer;
const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;
const sequelize = models.sequelize;

router.get('/questions/:sessionId/', function(req, res) {
  const sessionId = req.params.sessionId;

  Question.findAll({
    where: {
      reviewSessionId: sessionId,
    }
  }).then(function(qs) {
    res.send(qs.map(q => q.dataValues));
  });

});

router.get('/peers/all/:userId', function(req, res) {
  User.findAll({
    where: {
      id: {
        $ne: req.params.userId,
      },
    },
  }).then(function(users) {
    res.send(users.map(function(u) { return u.dataValues; }));
  });
});

router.get('/reviewers/:userId/:sessionId/', function(req, res) {
  const userId = req.params.userId;
  const sessionId = req.params.sessionId;

  Reviewer.findAll({
    where: {
      userId: {
        $ne: userId,
      },
      reviewSessionId: sessionId,
    },
  }).then(function(reviewers) {
    const userIds = reviewers.map(r => r.dataValues.userId);

    User.findAll({
      where: {
        id: {
          $in: userIds,
        },
      },
    }).then(function(users) {
      res.send(users.map(u => u.dataValues));
    });
  });

});

router.get('/reviewsession/:userId/', function(req, res) {
  /**
    gets review sessions that user is included in
   */

  const userId = req.params.userId;

  Reviewer.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('reviewsessionid')), 'reviewSessionId']],
    where: {
      userId: userId,
    },
  }).then(function(rs) {
    const reviewSessionIds = rs.map(r => r.dataValues.reviewSessionId);

    ReviewSession.findAll({
      where: {
        id: {
          $in: reviewSessionIds,
        },
      },
    }).then(function(reviewSessions) {
      res.send(reviewSessions.map(r => r.dataValues));
    });
  });

});

router.post('/reviewsession/create/', function(req, res) {
  const body = req.body;
  const reviewers = body.reviewers;
  const deadline = body.deadline;
  const creatorId = body.creatorId;
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
