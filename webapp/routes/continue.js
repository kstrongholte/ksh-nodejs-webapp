const express = require('express');
const router = express.Router();


router.get('/continue', (req, res, next) => {
  res.render('continue', {
    title: 'Continue',
    state: req.query.state
  });
});

module.exports = router;
