const Sequelize = require('sequelize');
const p2pConfig = require('../p2pConfig.json');

const sequelize = new Sequelize('mysql', 'root', 'root', {
  host: "127.0.0.1",
  port: 3306
});

const ReviewSession = sequelize.define(
  'reviewsession',
  {
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    deadline: {
      type: Sequelize.DATE,
      field: 'deadline'
    },
    createdBy: {
      type: Sequelize.STRING,
      field: 'createdby'
    }
  },
  {
    freezeTableName: true // Model tableName will be the same as the model name
  }
);

ReviewSession.sync({force: true});

const Reviewer = sequelize.define(
  'reviewer',
  {
    email: {
      type: Sequelize.STRING,
      field: 'email'
    },
    reviewSessionId: {
      type: Sequelize.STRING,
      field: 'reviewsessionid'
    },
    userId: {
      type: Sequelize.STRING,
      field: 'userid'
    },
  },
  {
    freezeTableName: true
  }
);

Reviewer.sync({force: true});

const Question = sequelize.define(
  'question',
  {
    questionType: {
      type: Sequelize.STRING,
      field: 'questiontype'
    },
    reviewSessionId: {
      type: Sequelize.STRING,
      field: 'reviewsessionid'
    },
    content: {
      type: Sequelize.STRING,
      field: 'content'
    }
  },
  {
    freezeTableName: true // Model tableName will be the same as the model name
  }
);

Question.sync({force: true});

const User = sequelize.define(
  'users',
  {
    admin: {
      type: Sequelize.BOOLEAN,
      field: 'admin'
    },
    reviewer: {
      type: Sequelize.BOOLEAN,
      field: 'reviewer'
    },
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    email: {
      type: Sequelize.STRING,
      field: 'email'
    }
  },
  {
    freezeTableName: true // Model tableName will be the same as the model name
  }
);

User.sync({force: true}).then(function() {
  return p2pConfig.reviewers.map(function(r) {
    return User.create({
      reviewer: true,
      admin: false,
      email: r.email,
      name: r.name,
    });
  }).concat([
    User.create({
      name: p2pConfig.admin.name,
      email: p2pConfig.admin.email,
      admin: true,
      reviewer: false,
    })
  ]);
});

const Answer = sequelize.define(
  'answer',
  {
    answerType: {
      type: Sequelize.STRING,
      field: 'answertype'
    },
    questionId: {
      type: Sequelize.STRING,
      field: 'questionid'
    },
    reviewSessionId: {
      type: Sequelize.STRING,
      field: 'reviewsessionid'
    },
    content: {
      type: Sequelize.STRING,
      field: 'content'
    },
    reviewerId: {
      type: Sequelize.STRING,
      field: 'reviewerid'
    },
    peerId: {
      type: Sequelize.STRING,
      field: 'peerid'
    },
  },
  {
    freezeTableName: true
  }
);

Answer.sync({force: true});

const Reviewee = sequelize.define(
  'reviewee',
  {
    userId: {
      type: Sequelize.STRING,
      field: 'userid'
    },
    reviewedBy: {
      type: Sequelize.STRING,
      field: 'reviewedby'
    },
    email: {
      type: Sequelize.STRING,
      field: 'email'
    },
    reviewSessionId: {
      type: Sequelize.STRING,
      field: 'reviewsessionid'
    }
  },
  {
    freezeTableName: true
  }
);

Reviewee.sync({force: true});

const Reviewed = sequelize.define(
  'reviewed',
  {
    reviewerId: {
      type: Sequelize.STRING,
      field: 'reviewerid'
    },
    reviewedId: {
      type: Sequelize.STRING,
      field: 'reviewedid'
    },
    sessionId: {
      type: Sequelize.STRING,
      field: 'sessionid'
    },
  },
  {
    freezeTableName: true
  }
);

Reviewed.sync({force: true});

module.exports = {
  User: User,
  Answer: Answer,
  ReviewSession: ReviewSession,
  Question: Question,
  sequelize: sequelize,
  Reviewer: Reviewer,
  Reviewed: Reviewed,
  Reviewee: Reviewee,
};
