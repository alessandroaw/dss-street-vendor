const express = require('express');
const Store = require('../models/store');
const {authenticate} = require('../middleware/auth');
const router = new express.Router();

//POST route for updating data
router.post('/register', (req, res, next) => {
  // confirm that user typed same password twice

  if (req.body.password !== req.body.passwordConf) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
  }

  if (req.body.storeName &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {

      var userData = {
        storeName: req.body.storeName,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      };

      Store.create(userData, function (error, user) {
      if (error) {
          return next(error);
      } else {
          req.session.userId = user._id;
          return res.redirect('/');
      }
      });

  } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;
    
    try {
      const user = await Store.authenticate(username, password);
      req.session.storeId = user._id;
      res.redirect('/');
    
    } catch (e) {
      e.status = 400;
      next(e);
    }
  } 
});

// GET route after registering
router.get('/profile', authenticate, (req, res) => {
  user = req.user;
  res.send(`
    <h1>Username: </h1>${user.username} 
    <h2>StoreName: </h2>${user.storeName}<br>
    <a type="button" href="/user/logout">Logout</a>`)
});

// GET for logout logout
router.get('/logout',  (req, res, next) =>  {
  if (req.session) {
    // delete session object

    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});

module.exports = router;