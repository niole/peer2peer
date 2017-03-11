const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql', 'root', 'root', {
  host: "127.0.0.1",
  port: 3306
});


const ReviewSession = sequelize.define(
  'reviewsession',
  {
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
  return ["2", "3", "4"].map(function(u) {
    return User.create({
      name: "user"+u,
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
    from: {
      type: Sequelize.STRING,
      field: 'from'
    }
  },
  {
    freezeTableName: true
  }
);

Answer.sync({force: true});

module.exports = {
  User: User,
  Answer: Answer,
  ReviewSession: ReviewSession,
  Question: Question,
  sequelize: sequelize,
  Reviewer: Reviewer,
};
