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


admin.get('/user/:id', ensureAuthenticated, ensureAdmin, function(req, res){
     User.findById(req.params.id, function(err, user) {
        res.send(user);

    });
})


admin.get('/profilesquestionscreation', ensureAuthenticated, ensureAdmin, function(req, res) {


        res.render("profilesquestionscreation");
        

});



admin.get('/multiplechoice', ensureAuthenticated, ensureAdmin, function(req, res) {


        Mutliplechoice.find({}, function(err,questions){
            res.send(questions);
        });
        

});


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


admin.get('/populate',function(req,res){
    //var ObjectID = require('mongodb').ObjectID;
    var name = makeid();
    var age = getRandomInt(20,40);
    var newUser            = new User();
    newUser.local.email    = name;
    newUser.local.password = newUser.generateHash(name);
    newUser.age = age;
    if ((age-5) < 18 ){
        newUser.minage = 18;
    }
    else {
        newUser.minage = age-5;
    }
    newUser.maxage= age+5;

    Mutliplechoice.find({}).lean().exec(function(err,result){
        for (var i = 0; i < result.length; i++) {
            result[i].isAnswered = true;
            var random = getRandomInt(0, result[i].answers.length-1);
            result[i].answers[random].selection=true;
        }
        newUser.answers = result;

        newUser.save(function(err) {
                    if (err)
                        throw err;
                   res.redirect("/admin/populate2");
                });
    });
});




admin.get("/multiple",function(req,res){

    User.remove({}, function(){
        res.send("success");
    });

});
admin.get('/populate2',function(req,res){
    //var ObjectID = require('mongodb').ObjectID;
    var name = makeid();
    var age = getRandomInt(20,40);
    var newUser            = new User();
    newUser.local.email    = name;
    newUser.local.password = newUser.generateHash(name);
    newUser.age = age;
    if ((age-5) < 18 ){
        newUser.minage = 18;
    }
    else {
        newUser.minage = age-5;
    }
    newUser.maxage= age+5;

    Mutliplechoice.find({}).lean().exec(function(err,result){
        for (var i = 0; i < result.length; i++) {
            result[i].isAnswered = true;
            var random = getRandomInt(0, result[i].answers.length-1);
            result[i].answers[random].selection=true;
        }
        newUser.answers = result;

        newUser.save(function(err) {
                    if (err)
                        throw err;
                   res.redirect("/admin/populate");
                });
    });
});


module.exports = admin;