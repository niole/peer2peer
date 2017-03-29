# peer2peer
A no frill peer review application.

This application runs with:
* node 5.0.0
* npm 2.15.11
* ruby 2.1.7
* bundler 1.10.6


to install:

```
git clone git@github.com:niole/peer2peer.git; cd peer2peer; docker pull mysql; bundle; npm install;
```

initialize application's config by running:

```
npm run init
```

and then follow prompts to create an admin and create reviewers (reviewer creation at the command line is optional).

make sure to set the following variables in the application's .env file located in the root directory (which you will create):

```
GOOGLE_CLIENT_ID= -get from google dev console-
GOOGLE_CLIENT_SECRET= -get from google dev console-
EXPRESS_SESSION_SECRET= -string of your choice-
GOOGLE_AUTH_ROUTE= -get from google dev console-
GOOGLE_AUTH_CALLBACK= -get from google dev console-
```


to start:
```
 npm run docker-compose; npm start;
 ```
