const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();

dotenv.config();

router.get('/error', async (req, res, next) => {
    res.render('error', {
      title: 'Error',
      error: [
        {
          name: req.query.error,
          description: req.query.error_description
        }
      ]
    });
});

module.exports = router;
