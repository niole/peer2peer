"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Reviewed = models.Reviewed;
const Reviewer = models.Reviewer;
const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;
const sequelize = models.sequelize;


router.get('/admin/getid/:email/', function(req, res) {
  const email = req.params.email;

  User.findOne({
    where: {
      admin: true,
      email: email,
    },
  }).then(function(user) {
    if (user) {
      res.send(user.dataValues);
    }
    else {
      res.sendStatus(new Error("there is no admin with that email"));
    }
  });

});

router.get('/questions/answers/:reviewerId/:peerId/:sessionId', function(req, res) {
  const currentSessionId = req.params.sessionId;
  const peerId = req.params.peerId; //see what reviews have been created
  const reviewerId = req.params.reviewerId;

  Question.findAll({
    where: {
      reviewSessionId: currentSessionId,
    },
  }).then(function(qs) {
    Answer.findAll({
      where: {
        reviewerId: reviewerId,
        reviewSessionId: currentSessionId,
        peerId: peerId,
      },
    }).then(function(as) {
      res.send({
        answers: as.map(a => a.dataValues),
        questions: qs.map(q => q.dataValues),
      });
    });
  });

});

router.get('/reviewed/:currentSessionId/:peerId/', function(req, res) {
  //get all peers that are part of this session and have reviews by this peer
  const currentSessionId = req.params.currentSessionId;
  const peerId = req.params.peerId; //see what reviews have been created

  Reviewer.findAll({
    where: {
      reviewSessionId: currentSessionId,
      userId: {
        $ne: peerId,
      },
    },
  }).then(function(as) {
    const reviewed = as.map(a => a.dataValues.userId);

    User.findAll({
      where: {
        id: {
          $in: reviewed,
        },
      },
    }).then(function(us) {
      res.send(us.map(u => u.dataValues));
    });

  });

});

router.post('/answers/submit/', function(req, res) {
  //if previously reviewed, update, else, create
  const answers = req.body.answers;

  Answer.findAll({
    where: {
      reviewSessionId: answers[0].reviewSessionId,
      reviewerId: answers[0].reviewerId,
    },
  }).then(function(prevAnswers) {
    const answerData = prevAnswers.map(function(a) { return a.dataValues; });

    if (!answerData.length) {

      Answer.bulkCreate(answers).then(function() {
        Reviewed.create({
          sessionId: answers[0].reviewSessionId,
          reviewerId: answers[0].reviewerId,
          reviewedId: answers[0].peerId,
        }).then(function(r) {
          res.send(r.dataValues);
        });
      });

    }
    else {
      const answersToUpdate = answers.filter(function(a) {
        return !!answerData.find(function(otherA) {
          return a.questionId === otherA.questionId;
        });
      });
      let updated = [];
      answersToUpdate.forEach(function(ans) {

        Answer.update(
          ans,
         {
          where: {
            questionId: ans.questionId
          },
        }).then(function() {
          updated.push(true);
          if (updated.length === answersToUpdate.length) {
            //get reviewed
            Reviewed.findOne({
              where: {
                sessionId: answers[0].reviewSessionId,
                reviewerId: answers[0].reviewerId,
                reviewedId: answers[0].peerId,
              },
            }).then(function(r) {
              res.send(r.dataValues);
            });

          }
        });

      });

    }
  });
});

router.get('/questions/:sessionId/', function(req, res) {
  const sessionId = req.params.sessionId;

  Question.findAll({
    where: {
      reviewSessionId: sessionId,
    }
  }).then(function(qs) {
    res.send({ questions: qs.map(q => q.dataValues) });
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
      Reviewed.findAll({
        where: {
          sessionId: sessionId,
        },
      }).then(function(rs) {

        res.send({
          reviewers: users.map(u => u.dataValues),
          reviewed: rs.map(r => r.dataValues),
        });

      });
    });
  });

});

router.get('/reviewsession/createdby/:userId/', function(req, res) {
  /**
   * gets all review sesssions created by user with userId
   */
  const userId = req.params.userId;

  ReviewSession.findAll({
    where: {
      createdBy: userId,
    },
  }).then(function(rs) {
    res.send(rs.map(r => r.dataValues));
  });

});

router.get('/reviewsession/includes/:userId/', function(req, res) {
  /**
   * gets review sessions that user is included in
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
  /**
    creates review session,
    create questions for review session
    create reviewers for session
    creates non-admin users for session if don't already exist
   */

  const body = req.body;
  const reviewers = body.reviewers;
  const deadline = body.deadline;
  const creatorId = body.creatorId;
  const questions = body.questions;
  const name = body.currentSessionName;

  ReviewSession.create({
    createdBy: creatorId,
    deadline,
    name,
  }).then(function(s) {
    const session = s.dataValues;
    const newQuestions = questions.map(function(q) {
      return {
        questionType: q.questionType,
        reviewSessionId: session.id,
        content: q.content,
      };
    });

    Question.bulkCreate(newQuestions).then(function() {
      let allCreated = [];

      reviewers.forEach(function(r) {
        User.findOne({
          where: {
            email: r.email,
            admin: false,
          },
        }).then(function(user) {
          if (!user) {

            User.create({
              name: r.email,
              email: r.email,
              admin: false,
            }).then(function(newUser) {
              const userData = newUser.dataValues;

              Reviewer.create({
                email: r.email,
                reviewSessionId: session.id,
                userId: userData.id,
              }).then(function() {
                allCreated.push(true);
                if (allCreated.length === reviewers.length) {
                  res.send(true);
                }
              });
            });

          }
          else {
            //just create reviewer
            const userData = user.dataValues;

            Reviewer.create({
              email: r.email,
              reviewSessionId: session.id,
              userId: userData.id,
            }).then(function() {
              allCreated.push(true);
              if (allCreated.length === reviewers.length) {
                res.send(true);
              }
            });

          }
        });

      });

    });

  });

});

router.get('/user/:email', function(req, res) {
  User.findOne({
    where: {
      email: req.params.email,
    },
  }).then(function(user) {
    if (user) {
      res.send(user.dataValues);
    }
    else {
      res.send(new Error("There is no user with that email."));
    }
  });
});

module.exports = router;
