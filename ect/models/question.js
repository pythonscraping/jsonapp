var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');

var openquestionSchema = mongoose.Schema({
    
    name: String,
    question: String,
    answer: String,
    isAnswered: { type: Boolean, default: false }

});


module.exports = mongoose.model('Openquestion', openquestionSchema);