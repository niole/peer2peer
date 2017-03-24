const Sequelize = require('sequelize');

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
    name: {
      type: Sequelize.STRING,
      field: 'name'
    },
    authId: {
      type: Sequelize.STRING,
      field: 'authId'
    }
  },
  {
    freezeTableName: true // Model tableName will be the same as the model name
  }
);

User.sync({force: true}).then(function() {
  return ["1", "2", "3"].map(function(u) {
    return User.create({
      name: "user"+u,
      admin: u === "1",
      authId: u,
    });
  });
});

const Answer = sequelize.define(
  'answer',
  {
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
};
