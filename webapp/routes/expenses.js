const dotenv = require('dotenv');
const express = require('express');
const secured = require('../lib/middleware/secured.js');
const router = express.Router();

dotenv.config();

router.get('/expenses', secured(), async (req, res, next) => {
    res.render('expenses', {
      title: 'Expenses',
      expenses: [
        {
          date: new Date(),
          description: 'I went to Vegas for a convention and no I don\'t have any receipts.',
          value: 109349890343,
        }
      ]
    });
});

module.exports = router;
