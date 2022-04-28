const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require('./Users.model');
db.position = require('./Position.model');
db.POSITION = ["user", "admin", "moderator"];
module.exports = db;