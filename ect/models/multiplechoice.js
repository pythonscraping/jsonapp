var mongoose = require('mongoose');



var choiceSchema = mongoose.Schema({
    
    answer: String,
    selection: { type: Boolean, default: false }

});

var multiplechoiceSchema = mongoose.Schema({
    
    name: String,
    question: String,
    answers:[choiceSchema],
    isAnswered: { type: Boolean, default: false }

});


module.exports = mongoose.model('MutlipleChoice', multiplechoiceSchema);
