require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, family:4 })
  .then(result => console.log('connected to db'))
  .catch(err => console.log(err));