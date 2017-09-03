const mongoose = require('mongoose');
const mongooschema = require('./mongooschema').scheemer;
mongoose.connect('mongodb://localhost/lectcal')
var db = mongoose.connection
db.on('error',console.error.bind(console,"connection error:"))
db.once('open',mongooschema)
