var Store = require('../models/store');
console.log('jalan boifsdfs');

const authenticate = (req, res, next) => {
  console.log('jalan boi');
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
};

const notAuthenticate = (req, res, next) => {
  if(req.session.storeId){
    res.redirect('/')
  } else {
    next();
  }
};

module.exports = {authenticate, notAuthenticate};