const express = require('express');
const StoreTemp = require('../models/store');
const {authenticate} = require('../middleware/auth');
const router = new express.Router();

//POST route for updating data
router.post('/register', (req, res, next) => {
  // confirm that user typed same password twice
  console.log(req.body);
  
  if (req.body.password !== req.body.passwordConf) {
      const err = new Error('Passwords do not match.');
      err.status = 400;
      res.send("passwords dont match");
      return next(err);
  }

  if (req.body.email &&
      req.body.username &&
      req.body.password &&
      req.body.passwordConf) {

      var adminData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
      };

      StoreTemp.create(adminData, function (error, admin) {
      if (error) {
          return next(error);
      } else {
          req.session.adminId = admin._id;
          return res.redirect('/profile');
      }
      });

  } else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
  }
});

router.post('/admin/login', async (req, res, next) => { 
  
  if (req.body.email && req.body.password) {
    var email = req.body.email;
    var password = req.body.password;
    
    try {
      const admin = await StoreTemp.authenticate(email, password);
      req.session.adminId = admin._id;
      res.redirect('/admin/sirkulasi');
    
    } catch (e) {
      e.status = 400;
      next(e);
    }
  } 
});

// GET route after registering
router.get('/profile', authenticate, (req, res) => {
  admin = req.admin;
  res.send(`
    <h1>Name: </h1>${admin.username} 
    <h2>Mail: </h2>${admin.email}<br>
    <a type="button" href="/admin/logout">Logout</a>`)
});

// GET for logout logout
router.get('/admin/logout',  (req, res, next) =>  {
  if (req.session) {
    // delete session object

    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/admin/login');
      }
    });
  }
});

module.exports = router;

const properDate = (val) => {
    let date = new Date(val);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return `${dd}/${mm}/${yyyy}`;
};