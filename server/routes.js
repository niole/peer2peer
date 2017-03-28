"use strict";
const express = require('express');
const router = express.Router();
const models = require('./Models.js');

const Reviewee = models.Reviewee;
const Reviewed = models.Reviewed;
const Reviewer = models.Reviewer;
const Answer = models.Answer;
const User = models.User;
const ReviewSession = models.ReviewSession;
const Question = models.Question;
const sequelize = models.sequelize;

const NO_ACCESS_ERROR = "Access denied.";

function authHandler(ifTrue, executeThis) {
  if (ifTrue) {
    executeThis();
  }
  else {
    throw new Error(NO_ACCESS_ERROR);
  }
}

router.get('/questions/answers/:reviewerId/:peerId/:sessionId', function(req, res) {
  /**
      gets all questions and answers for related readable or writable session
      specific to a reviewer, a peer (reviewee), and a session
      user must be reviewer
      or session creator
   */
  const currentSessionId = req.params.sessionId;
  const peerId = req.params.peerId; //see what reviews have been created
  const reviewerId = req.params.reviewerId;

  if (req.user.admin) {
    ReviewSession.findOne({
      where: {
        createdBy: req.user.id,
        id: currentSessionId
      },
    }).then(function(rs) {
      authHandler(
        !!rs,
        function() {
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
        }
      );
    });
  }
  else {
    //user is not an admin
    //must be reviewer

    authHandler(
      req.user.id.toString() === reviewerId,
      function() {
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
      }
    );
  }
});

router.get('/reviewed/:currentSessionId/:peerId/', function(req, res) {
  /*
    get all peers that are part of this session and have reviews by this peer
  */

  const currentSessionId = req.params.currentSessionId;
  const peerId = req.params.peerId; //see what reviews have been created

  authHandler(
    req.user.admin, //does short circuit check to preempt db queries if not admin
    function() {
      ReviewSession.findOne({
        where: {
          createdBy: req.user.id,
          id: currentSessionId,
        },
      }).then(function(adminReviewSession) {

        authHandler(
          !!adminReviewSession,
          function() {
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

      });
    });
});

router.post('/answers/submit/', function(req, res) {
  //if previously reviewed, update, else, create
  const answers = req.body.answers;

  authHandler(
    req.user.id.toString() === answers[0].reviewerId,
    function() {
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

router.get('/reviewees/:reviewerId/:sessionId', function(req, res) {
  /**
   * gets all reviewees associated with a Reviewer instance
   * and a ReviewSession instance
   * TODO implement auth
   */

  const reviewerId = req.params.reviewerId;
  const sessionId = req.params.sessionId;

  Reviewee.findAll({
    where: {
      reviewedBy: reviewerId,
      reviewSessionId: sessionId,
    },
  }).then(function(rs) {
    const reviewees = rs.map(r => r.dataValues);
    res.send(reviewees);
  });
});

router.get('/reviewers/:userId/:sessionId/', function(req, res) {
  /*
   * TODO for non admins, reviewable peers are now the Reviewees associated with a Reviewer
   * this endpoint is now only for admins
   * get reviewable peers
   * user is either part of the peers in the review session or is the admin
   */

  const userId = req.params.userId;
  const sessionId = req.params.sessionId;

  Reviewer.findOne({
    where: {
      userId: userId,
      reviewSessionId: sessionId,
    },
  }).then(function(r) {

    authHandler(
      (!req.user.admin && r && r.dataValues.reviewSessionId === sessionId) || req.user.admin,
      function() {
        ReviewSession.findOne({
          where: {
            createdBy: userId,
          },
        }).then(function(rs) {

          authHandler(
            !req.user.admin || req.user.admin && rs,
            function() {
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

            }
          );

        });
      }
    );
  });

});

router.get('/reviewsession/createdby/:userId/', function(req, res) {
  /**
   * gets all review sesssions created by user with userId
   */
  const userId = req.params.userId;

  if (req.user.id.toString() === userId) {
    ReviewSession.findAll({
      where: {
        createdBy: userId,
      },
    }).then(function(rs) {
      res.send(rs.map(r => r.dataValues));
    });
  }
  else {
    throw new Error(NO_ACCESS_ERROR);
  }

});

router.get('/reviewsession/includes/:userId/', function(req, res) {
  /**
   * gets review sessions that user is included in
   */

  const userId = req.params.userId;

  authHandler(
    req.user.id.toString() === userId,
    function() {
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
    }
  );

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

  authHandler(
    req.user.admin && req.user.id.toString() === creatorId,
    function() {
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
    }
  );

});

router.get('/user/', function(req, res) {
  if (req.user) {
    res.send(req.user);
  }
  else {
    throw new Error("There is no user in this session.");
  }
});

module.exports = router;
