var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var StoreSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  },
});

StoreSchema.methods.toJSON = function () {
  const store = this;
  const storeObject = store.toObject();

  delete storeObject.password;
  delete storeObject.passwordConf;

  return storeObject;

}

//authenticate input against database
StoreSchema.statics.authenticate = async function (username, password) {
  
  const store = await Store.findOne({username});
  
  if(!store){
    throw new Error('Unable to login');
  }

  const match = await bcrypt.compare(password, store.password);

  if(!match){
    throw new Error('Unable to login')
  }
  
  return store;
}

//hashing a password before saving it to the database
StoreSchema.pre('save', async function (next) {
  const store = this;
  
  if(store.isModified('password')) {
    store.password = await bcrypt.hash(store.password, 10);
  }

  next();

});


var Store = mongoose.model('Stores', StoreSchema);
module.exports = Store;
