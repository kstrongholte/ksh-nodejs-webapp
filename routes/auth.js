const express = require('express');
const passport = require('passport');
const dotenv = require('dotenv');
const util = require('util');
const url = require('url');
const querystring = require('querystring');

const router = express.Router();

dotenv.config();

router.get('/login', (req, res) => {
  passport.authenticate('auth0', {
    audience: process.env.AUTH0_API_AUDIENCE,
    scope: 'openid profile email'
  })(req, res);
});

router.get('/login/:connection', (req, res) => {
  passport.authenticate('auth0', {
    audience: process.env.AUTH0_API_AUDIENCE,
    scope: 'openid profile email',
    connection: req.params.connection
  })(req, res);
});

router.get('/callback', (req, res, next) => {
  passport.authenticate('auth0', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/');
    req.logIn(user, (err) => {
      if(err) return next(err);
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || '/');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  var returnTo = req.protocol + '://' + req.hostname;
  var port = process.env.PORT;

  //returnTo += ':' + port;

  var logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));
  var searchString = querystring.stringify({
    returnTo: returnTo,
    client_id: process.env.AUTH0_CLIENT_ID
    //federated: null
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

router.get('/logout/local', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/logout/auth0', (req, res) => {
  var returnTo = req.protocol + '://' + req.hostname;
  var port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo += ':' + port;
  }

  var logoutURL = new url.URL(util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN));

  var searchString = querystring.stringify({
    returnTo: returnTo,
    client_id: process.env.AUTH0_CLIENT_ID
    //federated: null
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

router.post('/logout-saml', (req, res) => {
  console.log('logout-saml called');
  console.log(req);
});

module.exports = router;
