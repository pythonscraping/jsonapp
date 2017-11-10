var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Mutliplechoice = require('../models/multiplechoice.js');

var userSchema = mongoose.Schema({

     local            : {
        email        : String,
        password     : String,
    },
    username: String,
    email: String,
    name: String,
    isAdmin: Boolean,
    age: Number,
    birthday: Date,
    gender: String,
    genderpref: String,
    minage: Number,
    maxage: Number,
    img: { data: Buffer, contentType: String },
    answers : [Mutliplechoice.schema],
    // availability
    from: Date,
    todate: Date,
    favorites: [String]
     

});



userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);      