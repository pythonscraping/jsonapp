var express = require('express');


var admin = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var User = require('./models/user.js');
var Mutliplechoice = require('./models/multiplechoice.js');


function ensureAdmin(req, res, next) {
  if (!req.user.isAdmin) {
        return next(); 
    }
    res.redirect('/login');
}


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/login');
}




// ADMIN PAGE TO VIEW USERS INFORMATION
admin.get('/', ensureAuthenticated, ensureAdmin, function(req, res) {
	   
            res.render("adminhome");
    

});



// CREATE A NEW SCENARIO
admin.get('/users', ensureAuthenticated, ensureAdmin, function(req, res) {

            User.find({},function(err,users){
                res.render("users",{users: users});
            });

});



admin.get('/profilesquestionscreation', ensureAuthenticated, ensureAdmin, function(req, res) {


        res.render("profilesquestionscreation");
        

});



admin.get('/multiplechoice', ensureAuthenticated, ensureAdmin, function(req, res) {


        Mutliplechoice.find({}, function(err,questions){
            res.send(questions);
        });
        

});



module.exports = admin;