import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'jquery';
import App from './view/App.jsx';
import store from './store.js';


document.addEventListener("DOMContentLoaded", () => {
  if (window.sessionStorage.accessToken) {
    $.ajax({
      url: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${window.sessionStorage.accessToken}`,
      success: profileData => {

        ReactDOM.render(
          <Provider store={ store }>
            <App userEmail={ profileData.email }/>
          </Provider>,
          document.getElementById('app')
        );

      },
      error: err => window.location = "http://localhost:3000/login", //send user to login, token is old or wrong
    });

  }
  else {
    //redirect to login
    window.location = "http://localhost:3000/login";
  }
});
