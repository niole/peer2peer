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
    get all Reviewees that are part of this session whose reviewer is the peer
    user must be an admin and have created this session
  */

  const currentSessionId = req.params.currentSessionId;
  const peerId = req.params.peerId;

  authHandler(
    req.user.admin,
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
            Reviewer.findOne({
              where: {
                userId: peerId,
              },
            }).then(function(reviewer) {
              Reviewee.findAll({
                where: {
                  reviewSessionId: currentSessionId,
                  reviewedBy: reviewer.dataValues.id,
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
          peerId: answers[0].peerId,
        },
      }).then(function(prevAnswers) {
        const answerData = prevAnswers.map(function(a) { return a.dataValues; });

        if (!answerData.length) {
          //if no previous answers

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
              return a.questionId === otherA.questionId && a.content !== otherA.questionId;
            });
          });

          if (answersToUpdate.length) {
            let updated = 0;

            answersToUpdate.forEach(function(ans) {
              delete ans.id;
              Answer.update(
                ans,
               {
                where: {
                  questionId: ans.questionId
                },
              }).then(function() {
                updated += 1;
                if (updated === answersToUpdate.length) {
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
          else {
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

router.get('/reviewees/:userId/:sessionId', function(req, res) {
  /**
   * gets all reviewees associated with a Reviewer instance
   * and a ReviewSession instance
   * TODO implement auth
   */

  const userId = req.params.userId;
  const sessionId = req.params.sessionId;

  Reviewer.findOne({
    where: {
      reviewSessionId: sessionId,
      userId: userId,
    },
  }).then(function(reviewer) {
    const reviewerId = reviewer.dataValues.id;

    Reviewee.findAll({
      where: {
        reviewedBy: reviewerId,
        reviewSessionId: sessionId,
      },
    }).then(function(rs) {

      const userIds = rs.map(r => r.dataValues.userId);
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
});

router.get('/reviewers/:userId/:sessionId/', function(req, res) {
  /*
   * this endpoint is now only for admins
   * get reviewable peers
   * user is either part of the peers in the review session or is the admin
   */

  const userId = req.params.userId;
  const sessionId = req.params.sessionId;

  ReviewSession.findOne({
    where: {
      createdBy: userId,
    },
  }).then(function(rs) {
    authHandler(
      req.user.admin && rs && req.user.id.toString() === userId,
      function() {
        Reviewer.findAll({
          where: {
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
  const sessionReviewees = body.sessionReviewees;

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
          let allCreated = 0;
          let reviewerEmails = reviewers.map(r => r.email);

          User.findAll({
            where: {
              email: {
                $in: reviewerEmails,
              },
            },
          }).then(function(foundUsers) {
            if (foundUsers.length !== reviewerEmails.length) {
              //create users
              const usersToCreate = reviewerEmails
                .filter(email => !foundUsers.find(found => found.dataValues.email === email))
                .map(email => {
                  return {
                    admin: email === req.user.email,
                    reviewer: true,
                    name: email,
                    email: email,
                  };
                });

              User.bulkCreate(usersToCreate).then(function(users) {
                /**
                   a peculiarity of MySQL makes it so that returned records just made with bulkCreate
                   have ID = NULL. Must findAll
                 */
                User.findAll({
                  where: {
                    email: {
                      $in: users.map(u => u.dataValues.email),
                    },
                  },
                }).then(function(users) {
                  reviewerRevieweeCreatorHelper(foundUsers.concat(users), session, creatorId);
                });
              });
            }
            else {
              //create reviewers and then reviewees
              reviewerRevieweeCreatorHelper(foundUsers, session, creatorId);
            }
          });
        });
      });
    }
  );

  function reviewerRevieweeCreatorHelper(foundUsers, session, creatorUserId) {
    let emailToUserIdMap = {};

    const newReviewers = foundUsers.map(fu => {
      emailToUserIdMap[fu.dataValues.email] = fu.dataValues.id;
      return {
        email: fu.dataValues.email,
        reviewSessionId: session.id,
        userId: fu.dataValues.id,
      };
    });

    Reviewer.bulkCreate(newReviewers).then(function(reviewers) {
      Reviewer.findAll({
        where: {
          reviewSessionId: session.id,
          email: {
            $in: reviewers.map(r => r.dataValues.email),
          },
        },
      }).then(function(reviewers) {
        const reviewees = reviewers.reduce((reviewees, nextReviewer) => {
          const formattedReviewees = sessionReviewees[nextReviewer.dataValues.email].map(sr => {
            return {
              email: sr.email,
              reviewSessionId: session.id,
              userId: emailToUserIdMap[sr.email],
              reviewedBy: nextReviewer.dataValues.id,
            };
          });

          reviewees = reviewees.concat(formattedReviewees);
          return reviewees;
        }, []);

        Reviewee.bulkCreate(reviewees).then(function() {
          Reviewer.findOne({
            where: {
              userId: creatorUserId,
            },
          }).then(function(adminReviewer) {
            if (adminReviewer) {
              User.update({
                reviewer: true,
              }, {
                where: {
                  id: creatorUserId,
                },
              }).then(function() {
                  User.findOne({
                    where: {
                      id: creatorUserId,
                    },
                  }).then(function(user) {
                    res.send(user.dataValues);
                  });
              });

            }
            else {
              User.findOne({
                where: {
                  id: creatorUserId,
                },
              }).then(function(user) {
                res.send(user.dataValues);
              });
            }
          });
        });
      });
    });
  }

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
