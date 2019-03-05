const mongoose = require('mongoose');


const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    connectionId:String,
    handle:String
})

module.exports = mongoose.model('User',UserSchema);