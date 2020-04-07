const express = require('express');
const secured = require('../lib/middleware/secured.js');
const router = express.Router();

router.get('/user', secured(), (req, res, next) => {
  console.log(res);
  const { _raw, _json, ...userProfile } = req.user;
  res.render('user', {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: 'User Profile'
  });
});

module.exports = router;
