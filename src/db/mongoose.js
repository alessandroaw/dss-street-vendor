const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:dss3admin@ds251158.mlab.com:51158/dss-street-vendor';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
});

module.exports = mongoose;