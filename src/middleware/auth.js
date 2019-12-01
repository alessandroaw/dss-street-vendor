var Store = require('../models/store');

const authenticate = (req, res, next) => {
  Store.findById(req.session.storeId)
  .then((store) => {
    if(!store) {
      throw new Error('not found');
    }
    req.store = store;
    next();
  }).catch((e) => {
    res.redirect('/login');
  });
}

const notAuthenticate = (req, res, next) => {
  if(req.session.storeID){
    res.redirect('/profile')
  } else {
    next();
  }
}

module.exports = {authenticate, notAuthenticate}