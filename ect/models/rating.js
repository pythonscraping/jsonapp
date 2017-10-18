var mongoose = require('mongoose');



var ratingschema =  mongoose.Schema({
    
    name: String,
    question: String,
    rating: Number,
    isAnswered: { type: Boolean, default: false }

});


module.exports = mongoose.model('Rating', ratingschema);
