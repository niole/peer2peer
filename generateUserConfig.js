var fs = require('fs');
var _prompt = require('prompt');

_prompt.start();
_prompt.message = '';
_prompt.delimiter = '';
_prompt.colors = false;

var reviewers = [];
var admin = {};

function getReviewerName(email) {
  _prompt.get({
      properties: {
          // setup the dialog
          confirm: {
              pattern: /.+/gi,
              description: 'Type a name for your reviewer: ',
              message: 'Type a name for your reviewer',
              required: true,
              default: email,
          }
      }
  }, function (err, result){
      var name = result.confirm;

      reviewers.push({
        name: name,
        email: email,
      });

      return getReviewerEmail();
  });
}

function getReviewerEmail() {
  _prompt.get({
      properties: {
          // setup the dialog
          confirm: {
              pattern: /.+/gi,
              description: 'Type an email for your next reviewer, or press enter if done: ',
              message: 'Type an email for your next reviewer, or press enter if done',
              required: true,
              default: "done",
          }
      }
  }, function (err, result){
      var email = result.confirm;

      if (email === "done") {
        var config = { admin: admin, reviewers: reviewers };
        fs.writeFile("p2pConfig.json", JSON.stringify(config), function(err) {
            if(err) {
                return console.log(err);
            }

            console.log("peer2peerConfig.json added to root directory.");
        });
        return;
      }

      return getReviewerName(email);

  });
}

function getAdminEmail(name) {
  _prompt.get({
      properties: {
          // setup the dialog
          confirm: {
              pattern: /.+/gi,
              description: 'Type an email for your next admin: ',
              message: 'Type an email for your next admin',
              required: true,
              default: "done",
          }
      }
  }, function (err, result){
      var adminEmail = result.confirm;

      if (adminEmail === "done") {
        return;
      }

      admin.name = name;
      admin.email = adminEmail;

      return getReviewerEmail();

  });

}

function getAdminName() {
  _prompt.get({
      properties: {
          // setup the dialog
          confirm: {
              pattern: /.+/gi,
              description: 'Type a name for your admin: ',
              message: 'Type an name for your admin',
              required: true,
              default: "done",
          }
      }
  }, function (err, result){
      var adminName = result.confirm;

      if (adminName === "done") {
        return;
      }

      return getAdminEmail(adminName);
  });
}

getAdminName();
