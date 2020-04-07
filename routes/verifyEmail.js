const express = require('express');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const jwt_decode = require('jwt-decode');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: `${process.env.AUTH0_CLIENT_ID}`,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

router.get('/verifyEmail', (req, res, next) => {
  const authorizeAgainUrl = jwt_decode(req.query.token).authorize_again;
  res.render('verifyEmail', {
    title: 'Verify your email address',
    authorizeAgainUrl: authorizeAgainUrl,
    domain: process.env.AUTH0_DOMAIN
  });
});

module.exports = router;
